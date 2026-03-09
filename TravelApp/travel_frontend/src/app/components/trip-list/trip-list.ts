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
  map!: L.Map;
  nearbyHotels: any[] = [];
  selectedHotel: any = null;

  newTrip = {
    destination: '',
    startDate: '',
    endDate: '',
    user: { id: '' },
    hotelName: '',
    hotelLatitude: null as number | null,
    hotelLongitude: null as number | null
  };

  constructor(
    private tripService: TripService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initMap();
    const userJson = localStorage.getItem('currentUser');

    if (userJson) {
      const user = JSON.parse(userJson);
      this.tripService.getTripsByUserId(user.id).subscribe({
        next: (data) => {
          this.trips = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err)
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  // --- Map and API Logic ---

  private initMap(): void {
    this.map = L.map('map').setView([45.9432, 24.9668], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      // 1. GET CITY NAME (Reverse Geocoding)
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
          // Check various address fields because OSM data varies by region
          const address = data.address;
          const cityName = address.city || address.town || address.village || address.city_district || address.state || 'Unknown Location';

          this.newTrip.destination = cityName; // Updates the "Where to?" input
          this.cdr.detectChanges();
        })
        .catch(err => console.error("Geocoding failed", err));

      // 2. GET HOTELS (Overpass API)
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
          this.selectedHotel = null;
          this.cdr.detectChanges();
        })
        .catch(err => console.error("Hotel search failed", err));
    });
  }

  // --- User Actions ---

  // MOVED OUTSIDE of initMap()
  selectHotel(hotel: any): void {
    this.selectedHotel = hotel;
    // We do NOT change this.newTrip.destination here so it stays as the City name
    this.cdr.detectChanges();
  }

  saveTrip() {
    const userJson = localStorage.getItem('currentUser');
    if (userJson && this.selectedHotel) {
      const user = JSON.parse(userJson);

      const tripDto = {
        destination: this.newTrip.destination,
        startDate: this.newTrip.startDate,
        endDate: this.newTrip.endDate,
        userId: user.id,
        hotelName: this.selectedHotel.name,
        // Make sure these match your Java DTO field names!
        hotelLatitude: this.selectedHotel.latitude,
        hotelLongitude: this.selectedHotel.longitude
      };

      this.tripService.addTrip(tripDto).subscribe({
        next: (savedTrip) => {
          this.trips.push(savedTrip);
          this.resetForm();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Booking failed', err)
      });
    }
  }

  private resetForm() {
    this.newTrip = {
      destination: '',
      startDate: '',
      endDate: '',
      user: { id: '' },
      hotelName: '',
      hotelLatitude: null,
      hotelLongitude: null
    };
    this.nearbyHotels = [];
    this.selectedHotel = null;
  }
}
