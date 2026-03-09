import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TripService } from '../../services/trip';
import { Trip } from '../../models/trip';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-trip-list',
  standalone: false,
  templateUrl: './trip-list.html',
  styleUrls: ['./trip-list.css']
})
export class TripListComponent implements OnInit {
  trips: any[] = [];

  constructor(
    private tripService: TripService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}
  map!: L.Map;
  ngOnInit(): void {
    this.initMap();
    const userJson = localStorage.getItem('currentUser');

    if(userJson){
      const user = JSON.parse(userJson);
      const loggedUserId = user.id;
      this.tripService.getTripsByUserId(loggedUserId).subscribe({
        next: (data) => {
          this.trips = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err)
      });
    } else{
      this.router.navigate(['/login']);
    }
  }
  newTrip = { destination: '', startDate: '', endDate: '', user: { id: '' } };

  saveTrip() {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson);

      const tripDto = {
        destination: this.newTrip.destination,
        startDate: this.newTrip.startDate,
        endDate: this.newTrip.endDate,
        userId: user.id
      };

      console.log('Final DTO being sent:', tripDto);

      this.tripService.addTrip(tripDto).subscribe({
        next: (savedTrip) => {
          console.log('Trip saved successfully!', savedTrip);
          this.trips.push(savedTrip);
          this.newTrip = { destination: '', startDate: '', endDate: '', user: { id: '' } };
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Backend still rejected it. Check the DTO field names!', err);
        }
      });
    }
  }
  private initMap(): void {
    this.map = L.map('map').setView([45.9432, 24.9668], 5); // centers on Europe

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          this.newTrip.destination = data.address.city || data.address.town || data.address.country;
          this.cdr.detectChanges();
        });
    });
  }
}
