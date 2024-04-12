import {Injectable} from "@angular/core";
import * as Leaflet from "leaflet";
import {MatDialog} from "@angular/material/dialog";
import {InfoPopupComponent} from "../info-popup/info-popup.component";

@Injectable({providedIn: "root"})
export class MapService {
  private marker: Leaflet.Marker | null = null;

  constructor(private dialog: MatDialog) {
  }

  handleMapClick(e: Leaflet.LeafletMouseEvent, map: Leaflet.Map): void {
    this.removeMarker(map);
    this.marker = new Leaflet.Marker(e.latlng).addTo(map);
    const currentLat = e.latlng.lat;
    const currentLng = e.latlng.lng;
    const dialogRef = this.dialog.open(InfoPopupComponent, {
      data: {lat: currentLat, lng: currentLng}, hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.removeMarker(map);
    });
  }

  private removeMarker(map: Leaflet.Map): void {
    if (this.marker) {
      map.removeLayer(this.marker);
      this.marker = null;
    }
  }
}
