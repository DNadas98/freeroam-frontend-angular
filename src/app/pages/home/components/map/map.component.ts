import {Component, NgZone, OnInit} from "@angular/core";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {HttpClientModule} from "@angular/common/http";
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption
} from "@angular/material/autocomplete";
import * as Leaflet from "leaflet";
import {Control, icon} from "leaflet";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MapService} from "../../../../service/map/map.service";
import {GeoLocation2d} from "../../../../model/map/GeoLocation2d";
import {catchError, debounceTime, Observable, of, switchMap} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {DetailedGeoLocationDto} from "../../../../model/map/DetailedGeoLocationDto";
import {InfoPopupComponent} from "../info-popup/info-popup.component";
import {environment} from "../../../../../environments/environment";
import {
  AutoCompleteGeoLocationResult
} from "../../../../model/map/AutoCompleteGeoLocationDto";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {
  MatCard,
  MatCardAvatar,
  MatCardHeader,
  MatCardTitle
} from "@angular/material/card";
import LayersObject = Control.LayersObject;

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
  standalone: true,
  imports: [
    LeafletModule,
    HttpClientModule,
    MatAutocomplete,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatOption,
    AsyncPipe,
    NgForOf,
    MatInput,
    MatFormField,
    MatLabel,
    MatIcon,
    NgIf,
    MatIconButton,
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardAvatar
  ],
  providers: [MapService]
})
export class MapComponent implements OnInit {
  private readonly _DEFAULT_ZOOM_LEVEL = 12;
  private readonly _ZOOMED_IN_ZOOM_LEVEL = 14;
  minElevationControl = new FormControl(1000);
  private readonly _MAX_ZOOM_LEVEL = 16;
  private readonly _MIN_ZOOM_LEVEL = 4;
  private readonly _markerIcon: Leaflet.Icon = icon({
    iconRetinaUrl: `${environment.MEDIA_BASE_URL}/marker-icon-2x.png`,
    iconUrl: `${environment.MEDIA_BASE_URL}/marker-icon.png`,
    shadowUrl: `${environment.MEDIA_BASE_URL}/marker-shadow.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
  });
  private readonly _baseLayers: LayersObject = {
    "OpenTopoMap": new Leaflet.TileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      attribution: "Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)"
    }),
    "OpenStreetMap": new Leaflet.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    })
  };
  private readonly _overLayers: Control.LayersObject = {
    "Summits": new Leaflet.GeoJSON(undefined, {
      style: (_feature) => {
        return {color: "#ffa55a", weight: 5, opacity: 0.65};
      },
      pointToLayer: (_feature, latlng) => {
        return Leaflet.circleMarker(latlng, {
          radius: 6,
          fillColor: "#ffa55a",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.7
        });
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup("");
        layer.on("click", () => {
          layer.closePopup();
          const data: DetailedGeoLocationDto = feature.properties;
          this.updateGeoLocation(data.latitude, data.longitude, this._ZOOMED_IN_ZOOM_LEVEL);
          this.showInfoPopup(data);
        });
      }
    })
  };
  private _summitsLayerVisible: boolean = false;
  maxElevationControl = new FormControl();
  private readonly _DETAILED_ZOOM_LEVEL: number = 10;
  private readonly _searchControl = new FormControl();
  private _geoLocation: GeoLocation2d = {latitude: 47.5, longitude: 19};  //Budapest
  private _currentZoomLevel: number = 12;
  private _map: Leaflet.Map | undefined;
  private _marker: Leaflet.Marker | null = null;
  private _filteredOptions: Observable<any[]> | undefined;

  constructor(private mapService: MapService, private dialog: MatDialog, private zone: NgZone) {
  }

  get summitsLayerVisible(): boolean {
    return this._summitsLayerVisible;
  }

  get currentZoomLevel(): number {
    return this._currentZoomLevel;
  }

  get DETAILED_ZOOM_LEVEL(): number {
    return this._DETAILED_ZOOM_LEVEL;
  }

  get filteredOptions(): Observable<any[]> | undefined {
    return this._filteredOptions;
  }

  get searchControl(): FormControl<any> {
    return this._searchControl;
  }

// Initialization

  ngOnInit() {
    this.initializeGeoLocation();
    this.initializeFilterOptions();
    this.initializeElevationControls();
  }

  clearMinElevationFilter() {
    this.minElevationControl.reset();
    this.updateGeoJsonLayer();
  }

  clearMaxElevationFilter() {
    this.maxElevationControl.reset();
    this.updateGeoJsonLayer();
  }

  private initializeGeoLocation() {
    navigator.geolocation.getCurrentPosition(position => {
      this.updateGeoLocation(position.coords.latitude, position.coords.longitude);
    }, error => {
      console.error(error);
      this.updateGeoLocation(this._geoLocation.latitude, this._geoLocation.longitude);
    });
  }

  onMapReady(map: Leaflet.Map) {
    this._map = map;
    map.setMaxZoom(this._MAX_ZOOM_LEVEL);
    map.setMinZoom(this._MIN_ZOOM_LEVEL);
    map.setZoom(this._DEFAULT_ZOOM_LEVEL);
    map.setView(new Leaflet.LatLng(this._geoLocation.latitude, this._geoLocation.longitude), this._DEFAULT_ZOOM_LEVEL);
    this._baseLayers["OpenTopoMap"].addTo(map);
    this._overLayers["Summits"].addTo(map);
    this._summitsLayerVisible = true;
    map.addControl(new Leaflet.Control.Layers(this._baseLayers, this._overLayers));
    map.on("overlayadd", event => {
      if (event.layer === this._overLayers["Summits"]) {
        this._summitsLayerVisible = true;
        this.updateGeoJsonLayer();
      }
    });
    map.on("overlayremove", event => {
      if (event.layer === this._overLayers["Summits"]) {
        this._summitsLayerVisible = false;
      }
    });
    map.on("click", e => this.handleMapClick(e));
    map.on("moveend", () => this.updateGeoJsonLayer());
    map.on("zoomend", () => {
      this.updateZoomLevel();
      this.updateGeoJsonLayer();
    });
  }

  // Handlers

  onOptionSelected(event: any): void {
    const {latitude, longitude} = event.option.value;
    this.mapService.fetchDetailedLocation(latitude, longitude).subscribe(data => {
      this.placeMarker(new Leaflet.LatLng(latitude, longitude));
      this.updateGeoLocation(latitude, longitude, this._ZOOMED_IN_ZOOM_LEVEL);
      this.showInfoPopup(data);
    });
    this._searchControl.setValue("");
  }

  displaySelectedOption(location: AutoCompleteGeoLocationResult | null): string {
    if (!location) {
      return "";
    }
    return `${location.name}`;
  }

  private initializeFilterOptions() {
    this._filteredOptions = this._searchControl.valueChanges.pipe(
      debounceTime(500),
      switchMap(value =>
        this.mapService.fetchSearchResults(value).pipe(
          catchError(_err => {
            return of([]);
          })
        )));
  }

  private initializeElevationControls() {
    this.minElevationControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.updateGeoJsonLayer();
    });

    this.maxElevationControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.updateGeoJsonLayer();
    });
  }


  private handleMapClick(e: Leaflet.LeafletMouseEvent) {
    if (!this._map) return;
    const {lat, lng} = e.latlng;
    this.mapService.fetchDetailedLocation(lat, lng).subscribe(data => {
      this.placeMarker(e.latlng);
      this.updateGeoLocation(lat, lng, this._ZOOMED_IN_ZOOM_LEVEL);
      this.showInfoPopup(data);
    });
  }

  private updateGeoJsonLayer() {
    this.zone.run(() => {
      if (!this._map || !this._overLayers["Summits"] || !this._summitsLayerVisible) {
        return;
      }
      if (this.currentZoomLevel >= this._DETAILED_ZOOM_LEVEL) {
        const minElevation = this.minElevationControl.value;
        const maxElevation = this.maxElevationControl.value;
        this.mapService.fetchGeoJsonData(this._map.getBounds(), minElevation, maxElevation)
          .subscribe(data => {
            const geoJson = this.createGeoJson(data);
            (this._overLayers["Summits"] as Leaflet.GeoJSON).clearLayers().addData(geoJson as any);
          });
      } else {
        (this._overLayers["Summits"] as Leaflet.GeoJSON).clearLayers();
      }
    });
  }

  private placeMarker(latlng: Leaflet.LatLng) {
    if (!this._map) return;
    if (this._marker) {
      this._map.removeLayer(this._marker);
    }
    this._marker = Leaflet.marker(latlng, {
      icon: this._markerIcon
    }).addTo(this._map);
  }

  private showInfoPopup(data: DetailedGeoLocationDto) {
    this.zone.run(() => {
      const dialogRef = this.dialog.open(InfoPopupComponent, {
        data: data,
        hasBackdrop: true,
        autoFocus: false
      });
      dialogRef.afterClosed().subscribe(() => {
        if (this._marker && this._map) {
          this._map.removeLayer(this._marker);
          this._marker = null;
        }
      });
    });
  }

  private updateZoomLevel() {
    this.zone.run(() => {
      if (this._map) {
        this._currentZoomLevel = this._map.getZoom();
      }
    });
  }

  private updateGeoLocation(latitude: number, longitude: number, newZoomLevel?: number) {
    this.zone.run(() => {
      this._geoLocation = {latitude, longitude};
      if (this._map) {
        let zoom = this.currentZoomLevel ?? this._DEFAULT_ZOOM_LEVEL;
        if (newZoomLevel && zoom < newZoomLevel) {
          zoom = newZoomLevel;
        }
        this._map.setView(new Leaflet.LatLng(latitude, longitude), zoom);
        this.updateZoomLevel();
      }
    });
  }

  private createGeoJson(data: DetailedGeoLocationDto[]) {
    return {
      type: "FeatureCollection",
      features: data.map(d => ({
        type: "Feature",
        properties: d,
        geometry: {
          type: "Point",
          coordinates: [d.longitude, d.latitude]
        }
      }))
    };
  }
}
