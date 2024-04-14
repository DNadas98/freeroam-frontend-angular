import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import {DetailedGeoLocationDto} from "../../model/map/DetailedGeoLocationDto";

@Injectable({providedIn: "root"})
export class MapService {
  constructor(private http: HttpClient) {
  }

  fetchSearchResults(query: string): Observable<any[]> {
    if (query.length < 3) {
      return of([]);
    }
    const url = `${environment.SUMMITS_SERVICE_BASE_URL}/public/geolocation/search?query=${query.toLowerCase()}`;
    return this.http.get<any[]>(url);
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
