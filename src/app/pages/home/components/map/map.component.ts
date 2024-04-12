import {Component} from "@angular/core";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import * as Leaflet from "leaflet";
import {MapService} from "../../../../service/map/map.service";
import {GeoLocation} from "../../../../model/map/GeoLocation";
import {MapOptions} from "leaflet";

@Component({
  selector: "app-map",
  standalone: true,
  imports: [
    LeafletModule
  ],
  templateUrl: "./map.component.html",
  styleUrl: "./map.component.scss"
})
export class MapComponent {
  private _geoLocation: GeoLocation = {lat: 0, lng: 0, alt: 0};
  private _map: Leaflet.Map | undefined;
  private readonly _options: Leaflet.MapOptions = {
    layers: [
      new Leaflet.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
      })
    ],
    zoom: 12,
    center: new Leaflet.LatLng(this._geoLocation.lat, this._geoLocation.lng)
  };

  get geoLocation(): GeoLocation {
    return this._geoLocation;
  }

  set geoLocation(value: GeoLocation) {
    this._geoLocation = value;
  }

  get map(): Leaflet.Map | undefined {
    return this._map;
  }

  set map(value: Leaflet.Map | undefined) {
    this._map = value;
  }

  get options(): MapOptions {
    return this._options;
  }

  constructor(private mapService: MapService) {
    navigator.geolocation.getCurrentPosition((position) => {
      const {latitude, longitude, altitude} = position.coords;
      if (isNaN(latitude) || isNaN(longitude)) {
        console.error("Invalid geolocation received");
        return;
      }
      this.geoLocation = {lat: latitude ?? 0, lng: longitude ?? 0, alt: altitude ?? 0};
      this.updateMapCenter();
    }, (positionError) => {
      console.error(positionError);
      this.updateMapCenter();
    });
  }

  onMapReady(map: Leaflet.Map) {
    this.map = map;
    this.map.on("click", (e: Leaflet.LeafletMouseEvent) => {
      this.mapService.handleMapClick(e, map);
    });
  }

  private updateMapCenter() {
    if (this.map) {
      this.map.setView(new Leaflet.LatLng(this.geoLocation.lat, this.geoLocation.lng), this.map.getZoom());
    }
  }
}
