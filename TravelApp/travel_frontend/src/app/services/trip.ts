import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getTripsByUserId(userId: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/trips/user/${userId}`);
  }
  addTrip(trip: any): Observable<any> {
    return this.http.post('http://localhost:8080/trips', trip);
  }
}
