import {Injectable, NgZone} from "@angular/core";
import * as Leaflet from "leaflet";
import {MatDialog} from "@angular/material/dialog";
import {
  InfoPopupComponent
} from "../../pages/home/components/info-popup/info-popup.component";
import {GeoLocation2d} from "../../model/map/GeoLocation2d";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {icon} from "leaflet";
import {DetailedGeoLocationDto} from "../../model/map/DetailedGeoLocationDto";

@Injectable({providedIn: "root"})
export class MapService {
  private _marker: Leaflet.Marker | null = null;
  private readonly markerIcon: Leaflet.Icon = icon({
    iconRetinaUrl: `${environment.MEDIA_BASE_URL}/marker-icon-2x.png`,
    iconUrl: `${environment.MEDIA_BASE_URL}/marker-icon.png`,
    shadowUrl: `${environment.MEDIA_BASE_URL}/marker-shadow.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
  });

  get marker(): Leaflet.Marker | null {
    return this._marker;
  }

  set marker(value: Leaflet.Marker | null) {
    this._marker = value;
  }

  constructor(private readonly dialog: MatDialog, private readonly zone: NgZone,
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

    const url = `${environment.SUMMITS_SERVICE_BASE_URL}/public/geolocation/details?latitude=${clickedLocation.latitude}&longitude=${clickedLocation.longitude}`;
    this.http.get<DetailedGeoLocationDto>(url, {observe: "response"}).subscribe({
      next: (response: HttpResponse<any>) => {
        if (response?.status > 399 || response?.body?.error || !response?.body) {
          console.error(response?.body?.error ?? "Failed to load location data");
          this.removeMarker(map);
          return;
        }
        const locationData: DetailedGeoLocationDto = response.body;
        this.marker = this.getStyledMarker(e.latlng);
        this.marker.addTo(map);
        const dialogRef = this.zone.run(() => this.dialog.open(InfoPopupComponent, {
          data: locationData, hasBackdrop: true
        }));
        dialogRef.afterClosed().subscribe(() => {
          this.removeMarker(map);
        });
      },
      error: (err) => {
        console.error("Failed to load location data", err);
        this.removeMarker(map);
      }
    });
  }

  private getStyledMarker(latlng: Leaflet.LatLng): Leaflet.Marker {
    const marker = new Leaflet.Marker(latlng);
    marker.options.icon = this.markerIcon;
    return marker;
  }

  private removeMarker(map: Leaflet.Map): void {
    if (this.marker) {
      map.removeLayer(this.marker);
      this.marker = null;
    }
  }
}
