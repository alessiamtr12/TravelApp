import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TripService } from '../../services/trip';
import { Trip } from '../../models/trip';

@Component({
  selector: 'app-trip-list',
  standalone: false,
  templateUrl: './trip-list.html',
  styleUrls: ['./trip-list.css']
})
export class TripListComponent implements OnInit {
  trips: any[] = [];
  userId = '8c48eacd-a860-4903-b900-71c5ff94aebf';

  constructor(
    private tripService: TripService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.tripService.getTripsByUserId(this.userId).subscribe({
      next: (data) => {
        console.log('--- DATA ARRIVED ---', data);
        this.trips = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Connection failed', err)
    });
  }
}
