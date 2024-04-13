import {Component} from "@angular/core";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import * as Leaflet from "leaflet";
import {MapService} from "../../../../service/map/map.service";
import {GeoLocation2d} from "../../../../model/map/GeoLocation2d";
import {Control, MapOptions} from "leaflet";
import LayersObject = Control.LayersObject;
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: "app-map",
  standalone: true,
  imports: [
    LeafletModule,
    HttpClientModule
  ],
  providers:[
    MapService
  ],
  templateUrl: "./map.component.html",
  styleUrl: "./map.component.scss"
})
export class MapComponent {
  private _geoLocation: GeoLocation2d = {latitude: 0, longitude: 0};
  private _map: Leaflet.Map | undefined;

  private readonly baseLayers: LayersObject = {
    "OpenStreetMap": new Leaflet.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }),
    "OpenTopoMap": new Leaflet.TileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      attribution: "Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)"
    })
  };

  private readonly _options: Leaflet.MapOptions = {
    zoom: 12,
    center: new Leaflet.LatLng(this._geoLocation.latitude, this._geoLocation.longitude),
    layers: [this.baseLayers["OpenStreetMap"]]
  };

  private readonly overlayLayers: LayersObject = {};

  get geoLocation(): GeoLocation2d {
    return this._geoLocation;
  }

  set geoLocation(value: GeoLocation2d) {
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
      const {latitude, longitude} = position.coords;
      if (isNaN(latitude) || isNaN(longitude)) {
        console.error("Invalid geolocation received");
        this.updateMapCenter();
        return;
      }
      this.geoLocation = {latitude: latitude ?? 0, longitude: longitude ?? 0};
      this.updateMapCenter();
    }, (positionError) => {
      console.error(positionError);
      this.updateMapCenter();
    });
  }

  onMapReady(map: Leaflet.Map) {
    this.map = map;
    const layerControl = new Leaflet.Control.Layers(this.baseLayers, this.overlayLayers);
    map.addControl(layerControl);
    this.map.on("click", (e: Leaflet.LeafletMouseEvent) => {
      this.mapService.handleMapClick(e, map).then();
    });
  }

  private updateMapCenter() {
    if (this.map) {
      this.map.setView(new Leaflet.LatLng(this.geoLocation.latitude, this.geoLocation.longitude), this.map.getZoom());
    }
  }
}
