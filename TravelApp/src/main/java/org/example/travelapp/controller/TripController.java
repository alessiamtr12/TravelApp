package org.example.travelapp.controller;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.model.HotelDTO;
import org.example.travelapp.model.Trip;
import org.example.travelapp.model.TripCreateDTO;
import org.example.travelapp.service.TripService;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class TripController {
    private final TripService tripService;

    @GetMapping("/trips/user/{userId}")
    public List<Trip> getTripsByUser(@PathVariable UUID userId) {
        return tripService.getTripsByUserId(userId);
    }
    @PostMapping("/trips")
    public Trip createTrip(@RequestBody TripCreateDTO tripCreateDTO) {
        return tripService.addTrip(tripCreateDTO);
    }
    @GetMapping("/trips/{tripId}/hotels")
    public List<HotelDTO> getNearbyHotels(@PathVariable UUID tripId){
        return tripService.getHotelsForTrip(tripId);
    }

}
