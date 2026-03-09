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
  nearbyHotels: any[] = [];
  selectedHotel: any = null;
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
  newTrip = { destination: '', startDate: '', endDate: '', user: { id: '' }, hotelName: '', hotelLatitude: null as number | null,  hotelLongitude: null as number | null};

  saveTrip() {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson);

      const tripDto = {
        destination: this.newTrip.destination,
        startDate: this.newTrip.startDate,
        endDate: this.newTrip.endDate,
        userId: user.id,
        hotelName: this.selectedHotel?.name,
        hotelLat: this.selectedHotel?.latitude,
        hotelLon: this.selectedHotel?.longitude
      };

      console.log('Final DTO being sent:', tripDto);

      this.tripService.addTrip(tripDto).subscribe({
        next: (savedTrip) => {
          console.log('Trip saved successfully!', savedTrip);
          this.trips.push(savedTrip);
          this.newTrip = { destination: '', startDate: '', endDate: '', user: { id: '' }, hotelName: '',  hotelLatitude: null as number | null,  hotelLongitude: null as number | null};
          this.nearbyHotels = [];
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
      const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node["tourism"="hotel"](around:5000,${lat},${lng});out;`;

      fetch(overpassUrl)
        .then(res => res.json())
        .then(data => {
          this.nearbyHotels = data.elements.map((h: any) => ({
            name: h.tags.name || "Unnamed Hotel",
            latitude: h.lat,
            longitude: h.lon,
            address: h.tags['addr:street'] || "Address unknown"
          }));
          this.cdr.detectChanges();
        });
    });
  }
  selectHotel(hotel: any) {
    this.selectedHotel = hotel;
    this.newTrip.destination = hotel.name + ", " + hotel.address;
    this.cdr.detectChanges();
  }
}
