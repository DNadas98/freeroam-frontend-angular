import {Injectable, NgZone} from "@angular/core";
import * as Leaflet from "leaflet";
import {MatDialog} from "@angular/material/dialog";
import {
  InfoPopupComponent
} from "../../pages/home/components/info-popup/info-popup.component";
import {GeoLocation} from "../../model/map/GeoLocation";

@Injectable({providedIn: "root"})
export class MapService {
  private marker: Leaflet.Marker | null = null;

  constructor(private dialog: MatDialog, private zone: NgZone) {
  }

  handleMapClick(e: Leaflet.LeafletMouseEvent, map: Leaflet.Map): void {
    this.removeMarker(map);
    this.marker = new Leaflet.Marker(e.latlng).addTo(map);
    const currentLocation: GeoLocation = {
      lat: e.latlng.lat ?? 0,
      lng: e.latlng.lng ?? 0,
      alt: e.latlng.alt ?? 0
    };
    if (isNaN(currentLocation.lat) || isNaN(currentLocation.lng)) {
      console.error("Invalid geolocation received");
      return;
    }
    const dialogRef = this.zone.run(() => this.dialog.open(InfoPopupComponent, {
      data: currentLocation, hasBackdrop: true
    }));

    dialogRef.afterClosed().subscribe((_result) => {
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
