import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, of, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {DetailedGeoLocationDto} from "../../model/map/DetailedGeoLocationDto";
import {
  AutoCompleteGeoLocationDto,
  AutoCompleteGeoLocationResult
} from "../../model/map/AutoCompleteGeoLocationDto";
import * as Leaflet from "leaflet";

@Injectable({providedIn: "root"})
export class MapService {
  constructor(private http: HttpClient) {
  }

  fetchSearchResults(query: string): Observable<AutoCompleteGeoLocationResult[]> {
    if (query.length < 3) {
      return of([]);
    }
    const encodedQuery = encodeURIComponent(query.trim().toLowerCase());
    const url = `${environment.SUMMITS_SERVICE_BASE_URL}/public/geolocation/search?query=${encodedQuery}`;
    return this.http.get<AutoCompleteGeoLocationDto>(url).pipe(
      map(response => response.results),
      catchError(err => {
        console.error("Failed to load autocomplete location data", err);
        return throwError(() => new Error(
          "Failed to fetch autocomplete location details"));
      })
    );
  }

  fetchDetailedLocation(latitude: number, longitude: number, isPeak: boolean = false): Observable<DetailedGeoLocationDto> {
    const url = `${environment.SUMMITS_SERVICE_BASE_URL}/public/geolocation/details?latitude=${latitude}&longitude=${longitude}&isPeak=${isPeak}`;
    return this.http.get<DetailedGeoLocationDto>(url).pipe(
      catchError(err => {
        console.error("Failed to load location data", err);
        return throwError(() => new Error("Failed to fetch location details"));
      })
    );
  }

  fetchGeoJsonData(bounds: Leaflet.LatLngBounds): Observable<DetailedGeoLocationDto[]> {
    const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
    const query = `[out:json][timeout:25];(node["natural"="peak"](${bbox}););out body;`;
    const url = `${environment.OVERPASS_API_URL}?data=${encodeURIComponent(query)}`;

    return this.http.get<any>(url).pipe(
      map(response => this.toDetailedGeoLocationDtos(response.elements)),
      catchError(err => {
        console.error("Failed to load peaks data", err);
        return throwError(() => new Error("Failed to fetch peaks data"));
      })
    );
  }

  private toDetailedGeoLocationDtos(elements: any[]): DetailedGeoLocationDto[] {
    return elements.map(element => ({
      latitude: element.lat,
      longitude: element.lon,
      elevation: element?.tags?.ele ? parseFloat(element.tags.ele) : undefined,
      displayName: element?.tags?.name,
      properties: {
        display_name: element?.tags?.name
      },
      licence: "Data provided by OpenStreetMap contributors"
    }));
  }
}
