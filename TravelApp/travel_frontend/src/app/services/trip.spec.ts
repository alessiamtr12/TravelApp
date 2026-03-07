import { TestBed } from '@angular/core/testing';
import { TripService } from './trip'; // Import the Service, not the Interface
import { HttpClientModule } from '@angular/common/http';

describe('TripService', () => {
  let service: TripService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [TripService]
    });
    service = TestBed.inject(TripService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
