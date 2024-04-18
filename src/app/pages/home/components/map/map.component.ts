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
import {AsyncPipe, NgForOf} from "@angular/common";
import {MatFormField, MatInput} from "@angular/material/input";
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
    MatIcon
  ],
  providers: [MapService]
})
export class MapComponent implements OnInit {
  private readonly _DEFAULT_ZOOM_LEVEL = 12;
  private readonly _DETAILED_ZOOM_LEVEL: number = 12;
  private readonly _MAX_ZOOM_LEVEL = 16;
  private readonly _MIN_ZOOM_LEVEL = 4;
  private readonly _baseLayers: LayersObject = {
    "OpenTopoMap": new Leaflet.TileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      attribution: "Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)"
    }),
    "OpenStreetMap": new Leaflet.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    })
  };
  private readonly _searchControl = new FormControl();
  private _geoLocation: GeoLocation2d = {latitude: 47.5, longitude: 19};  //Budapest
  private _currentZoomLevel: number = 12;
  private _map: Leaflet.Map | undefined;
  private _marker: Leaflet.Marker | null = null;
  private _peaksGeoJsonLayer: Leaflet.GeoJSON | null = null;
  private _filteredOptions: Observable<any[]> | undefined;

  constructor(private mapService: MapService, private dialog: MatDialog, private zone: NgZone) {
  }

  get currentZoomLevel(): number {
    return this._currentZoomLevel;
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
    this._filteredOptions = this._searchControl.valueChanges.pipe(
      debounceTime(500),
      switchMap(value =>
        this.mapService.fetchSearchResults(value).pipe(
          catchError(_err => {
            return of([]);
          })
        )
      )
    );
  }

  initializeGeoLocation() {
    navigator.geolocation.getCurrentPosition(position => {
      this.updateGeoLocation(position.coords.latitude, position.coords.longitude);
    }, error => {
      console.error(error);
      this.updateGeoLocation(this._geoLocation.latitude, this._geoLocation.longitude);
    });
  }

  onMapReady(map: Leaflet.Map) {
    this._map = map;
    const baseLayers = this._baseLayers;
    map.setMaxZoom(this._MAX_ZOOM_LEVEL);
    map.setMinZoom(this._MIN_ZOOM_LEVEL);
    map.setZoom(this._DEFAULT_ZOOM_LEVEL);
    baseLayers["OpenTopoMap"].addTo(map);
    map.addControl(new Leaflet.Control.Layers(baseLayers, {}));
    if (this._geoLocation.latitude !== 0 || this._geoLocation.longitude !== 0) {
      map.setView(new Leaflet.LatLng(this._geoLocation.latitude, this._geoLocation.longitude), 12);
    }
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
    this.updateGeoLocation(latitude, longitude);
    this.placeMarker(new Leaflet.LatLng(latitude, longitude));
    this.mapService.fetchDetailedLocation(latitude, longitude).subscribe(data => {
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

  private handleMapClick(e: Leaflet.LeafletMouseEvent) {
    if (!this._map) return;
    const {lat, lng} = e.latlng;
    this.mapService.fetchDetailedLocation(lat, lng).subscribe(data => {
      this.showInfoPopup(data);
      this.placeMarker(e.latlng);
      this.updateGeoLocation(lat, lng);
      this.zoomIn();
    });
  }

  private updateGeoJsonLayer() {
    this.zone.run(() => {
      if (!this._map) {
        return;
      }
      if (this._map.getZoom() >= this._DETAILED_ZOOM_LEVEL) {
        if (!this._peaksGeoJsonLayer) {
          this._peaksGeoJsonLayer = this.getLeafletGeoJson().addTo(this._map);
        }
        this.mapService.fetchGeoJsonData(this._map.getBounds())
          .subscribe(data => {
            const geoJson = this.createGeoJson(data);
            this._peaksGeoJsonLayer?.clearLayers().addData(geoJson as any);
          });
      } else if (this._peaksGeoJsonLayer) {
        this._map.removeLayer(this._peaksGeoJsonLayer);
        this._peaksGeoJsonLayer = null;
      }
    });
  }

  private placeMarker(latlng: Leaflet.LatLng) {
    if (!this._map) return;
    if (this._marker) {
      this._map.removeLayer(this._marker);
    }
    const markerIcon: Leaflet.Icon = icon({
      iconRetinaUrl: `${environment.MEDIA_BASE_URL}/marker-icon-2x.png`,
      iconUrl: `${environment.MEDIA_BASE_URL}/marker-icon.png`,
      shadowUrl: `${environment.MEDIA_BASE_URL}/marker-shadow.png`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    this._marker = Leaflet.marker(latlng, {
      icon: markerIcon
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

  private zoomIn() {
    const zoom = this._map?.getZoom();
    if (zoom && zoom < this._DEFAULT_ZOOM_LEVEL) {
      this._map?.setZoom(this._DEFAULT_ZOOM_LEVEL);
      this.updateZoomLevel();
    }
  }

  private updateZoomLevel() {
    this.zone.run(() => {
      if (this._map) {
        this._currentZoomLevel = this._map.getZoom();
      }
    });
  }

  private updateGeoLocation(latitude: number, longitude: number) {
    this._geoLocation = {latitude, longitude};
    if (this._map) {
      this._map.setView(new Leaflet.LatLng(latitude, longitude), this._map.getZoom() || 12);
    }
  }

  private getLeafletGeoJson() {
    return Leaflet.geoJSON(undefined, {
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
          this.showInfoPopup(data);
          this.updateGeoLocation(data.latitude, data.longitude);
          this.zoomIn();
        });
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
