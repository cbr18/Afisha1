import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Place, PlacesResponse } from '../models/place.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private readonly apiUrl = '/api/places';

  constructor(private readonly http: HttpClient) {}

  getPlaces(
    page: number = 1,
    pageSize: number = 10
  ): Observable<PlacesResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http
      .get<{ data: Place[]; total: number }>(this.apiUrl, { params })
      .pipe(
        map((response) => ({
          items: response.data,
          totalCount: response.total,
        }))
      );
  }

  getPlace(id: string): Observable<Place> {
    return this.http.get<Place>(`${this.apiUrl}/${id}`);
  }

  createPlace(place: Place): Observable<Place> {
    return this.http.post<Place>(this.apiUrl, place);
  }

  updatePlace(place: Place): Observable<Place> {
    return this.http.put<Place>(`${this.apiUrl}/${place.id}`, place);
  }

  deletePlace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
