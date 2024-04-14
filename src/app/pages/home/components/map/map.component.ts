import {Component, NgZone, OnInit} from "@angular/core";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {HttpClientModule} from "@angular/common/http";
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption
} from "@angular/material/autocomplete";
import * as Leaflet from "leaflet";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {AsyncPipe, NgForOf} from "@angular/common";
import {MatFormField, MatInput} from "@angular/material/input";
import {MapService} from "../../../../service/map/map.service";
import {GeoLocation2d} from "../../../../model/map/GeoLocation2d";
import {catchError, debounceTime, Observable, of, switchMap} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {Control, icon} from "leaflet";
import LayersObject = Control.LayersObject;
import {DetailedGeoLocationDto} from "../../../../model/map/DetailedGeoLocationDto";
import {InfoPopupComponent} from "../info-popup/info-popup.component";
import {environment} from "../../../../../environments/environment";
import {
  AutoCompleteGeoLocationResult
} from "../../../../model/map/AutoCompleteGeoLocationDto";

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
    MatFormField
  ],
  providers: [MapService]
})
export class MapComponent implements OnInit {
  private _geoLocation: GeoLocation2d = {latitude: 0, longitude: 0};
  private _map: Leaflet.Map | undefined;
  private _marker: Leaflet.Marker | null = null;

  searchControl = new FormControl();
  filteredOptions: Observable<any[]> | undefined;

  constructor(private mapService: MapService, private dialog: MatDialog, private zone: NgZone) {
  }

  ngOnInit() {
    this.initializeGeoLocation();
    this.filteredOptions = this.searchControl.valueChanges.pipe(
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
      this.updateGeoLocation(0, 0);
    });
  }

  updateGeoLocation(latitude: number, longitude: number) {
    this._geoLocation = {latitude, longitude};
    if (this._map) {
      this._map.setView(new Leaflet.LatLng(latitude, longitude), this._map.getZoom() || 12);
    }
  }

  onMapReady(map: Leaflet.Map) {
    this._map = map;
    const baseLayers = this.getBaseLayers();
    baseLayers["OpenTopoMap"].addTo(map);

    map.addControl(new Leaflet.Control.Layers(baseLayers, {}));
    map.on("click", e => this.handleMapClick(e));
    if (this._geoLocation.latitude !== 0 || this._geoLocation.longitude !== 0) {
      map.setView(new Leaflet.LatLng(this._geoLocation.latitude, this._geoLocation.longitude), 12);
    }
  }

  getBaseLayers(): LayersObject {
    return {
      "OpenTopoMap": new Leaflet.TileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution: "Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)"
      }),
      "OpenStreetMap": new Leaflet.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
      })
    };
  }

  handleMapClick(e: Leaflet.LeafletMouseEvent) {
    if (!this._map) return;
    this.mapService.fetchDetailedLocation(e.latlng.lat, e.latlng.lng).subscribe(data => {
      this.showInfoPopup(data);
      this.placeMarker(e.latlng);
    });
  }

  placeMarker(latlng: Leaflet.LatLng) {
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

  showInfoPopup(data: DetailedGeoLocationDto) {
    this.zone.run(() => {
      const dialogRef = this.dialog.open(InfoPopupComponent, {
        data: data,
        hasBackdrop: true
      });
      dialogRef.afterClosed().subscribe(() => {
        if (this._marker && this._map) {
          this._map.removeLayer(this._marker);
          this._marker = null;
        }
      });
    });
  }

  onOptionSelected(event: any): void {
    const {latitude, longitude} = event.option.value;
    this.updateGeoLocation(latitude, longitude);
    this.placeMarker(new Leaflet.LatLng(latitude, longitude));
    this.mapService.fetchDetailedLocation(latitude, longitude).subscribe(data => {
      this.showInfoPopup(data);
    });
    this.searchControl.setValue("");
  }

  displaySelectedOption(location: AutoCompleteGeoLocationResult | null): string {
    if (!location) {
      return "";
    }
    return `${location.name}`;
  }
}
