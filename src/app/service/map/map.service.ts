import {Injectable, NgZone} from "@angular/core";
import * as Leaflet from "leaflet";
import {MatDialog} from "@angular/material/dialog";
import {
  InfoPopupComponent
} from "../../pages/home/components/info-popup/info-popup.component";
import {GeoLocation2d} from "../../model/map/GeoLocation2d";
import {GeoLocation} from "../../model/map/GeoLocation";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({providedIn: "root"})
export class MapService {
  private _marker: Leaflet.Marker | null = null;

  get marker(): Leaflet.Marker | null {
    return this._marker;
  }

  set marker(value: Leaflet.Marker | null) {
    this._marker = value;
  }

  get dialog(): MatDialog {
    return this._dialog;
  }

  get zone(): NgZone {
    return this._zone;
  }

  constructor(private readonly _dialog: MatDialog, private readonly _zone: NgZone,
              private readonly http: HttpClient) {
  }

  async handleMapClick(e: Leaflet.LeafletMouseEvent, map: Leaflet.Map): Promise<void> {
    this.removeMarker(map);
    const clickedLocation: GeoLocation2d = {
      latitude: e.latlng.lat ?? 0, longitude: e.latlng.lng ?? 0
    };
    if (isNaN(clickedLocation.latitude) || isNaN(clickedLocation.longitude)) {
      console.error("Invalid geolocation received");
      return;
    }

    const url = `${environment.SUMMITS_SERVICE_BASE_URL}/public/geolocation/elevation?lat=${clickedLocation.latitude}&lng=${clickedLocation.longitude}`;
    this.http.get(url).subscribe({
      next: (response: any) => {
        const locationData:GeoLocation ={
          latitude:response?.latitude,
          longitude:response?.longitude,
          elevation:response?.elevation
        }
        this.marker = new Leaflet.Marker(e.latlng).addTo(map);
        const dialogRef = this._zone.run(() => this._dialog.open(InfoPopupComponent, {
          data: locationData, hasBackdrop: true
        }));
        dialogRef.afterClosed().subscribe(() => {
        });
      },
      error: (err) => {
        console.error("Failed to fetch location data", err);
        this.removeMarker(map);
      }
    });
  }

  private removeMarker(map: Leaflet.Map): void {
    if (this.marker) {
      map.removeLayer(this.marker);
      this.marker = null;
    }
  }
}
