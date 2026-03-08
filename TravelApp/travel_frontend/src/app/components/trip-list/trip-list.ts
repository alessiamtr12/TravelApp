import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TripService } from '../../services/trip';
import { Trip } from '../../models/trip';
import { Router } from '@angular/router';

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

  ngOnInit(): void {
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
}
