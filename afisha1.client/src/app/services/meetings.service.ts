import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meeting, MeetingsResponse } from '../models/meeting.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MeetingsService {
  private readonly apiUrl = '/api/meetings';

  constructor(private readonly http: HttpClient) {}

  getMeetings(
    page: number = 1,
    pageSize: number = 10
  ): Observable<MeetingsResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http
      .get<{ data: Meeting[]; total: number }>(this.apiUrl, { params })
      .pipe(
        map((response) => ({
          items: response.data,
          totalCount: response.total,
        }))
      );
  }

  getMeeting(id: string): Observable<Meeting> {
    return this.http.get<Meeting>(`${this.apiUrl}/${id}`);
  }

  createMeeting(meeting: Meeting): Observable<Meeting> {
    return this.http.post<Meeting>(this.apiUrl, meeting);
  }

  updateMeeting(meeting: Meeting): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.apiUrl}/${meeting.id}`, meeting);
  }

  deleteMeeting(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
