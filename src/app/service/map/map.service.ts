import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, of, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {DetailedGeoLocationDto} from "../../model/map/DetailedGeoLocationDto";
import {
  AutoCompleteGeoLocationDto,
  AutoCompleteGeoLocationResult
} from "../../model/map/AutoCompleteGeoLocationDto";

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

  fetchDetailedLocation(latitude: number, longitude: number): Observable<DetailedGeoLocationDto> {
    const url = `${environment.SUMMITS_SERVICE_BASE_URL}/public/geolocation/details?latitude=${latitude}&longitude=${longitude}`;
    return this.http.get<DetailedGeoLocationDto>(url).pipe(
      catchError(err => {
        console.error("Failed to load location data", err);
        return throwError(() => new Error("Failed to fetch location details"));
      })
    );
  }
}
