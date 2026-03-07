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

  // Matches your @GetMapping("/trips/user/{userId}")
  getTripsByUserId(userId: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/trips/user/${userId}`);
  }
}
