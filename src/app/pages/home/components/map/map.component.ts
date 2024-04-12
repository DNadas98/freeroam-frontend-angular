import {Component} from "@angular/core";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import * as Leaflet from "leaflet";
import {MapService} from "./map.service";

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
  private initialLat: number = 0;
  private initialLng: number = 0;
  private map!: Leaflet.Map;

  constructor(private mapService: MapService) {
    navigator.geolocation.getCurrentPosition((position) => {
      this.initialLat = position.coords.latitude;
      this.initialLng = position.coords.longitude;
      this.updateMapCenter();
    }, (positionError) => {
      console.error(positionError);
      this.updateMapCenter();
    });
  }


  options: Leaflet.MapOptions = {
    layers: [
      new Leaflet.TileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
      })
    ],
    zoom: 12,
    center: new Leaflet.LatLng(this.initialLat, this.initialLng)
  };

  onMapReady(map: Leaflet.Map) {
    this.map = map;
    this.map.on("click", (e: Leaflet.LeafletMouseEvent) => {
      this.mapService.handleMapClick(e, map);
    });
  }

  private updateMapCenter() {
    if (this.map) {
      this.map.setView(new Leaflet.LatLng(this.initialLat, this.initialLng), this.map.getZoom());
    }
  }
}
