package org.example.travelapp.service;

import lombok.RequiredArgsConstructor;
import org.example.travelapp.model.Trip;
import org.example.travelapp.model.TripCreateDTO;
import org.example.travelapp.model.User;
import org.example.travelapp.repository.TripRepository;
import org.example.travelapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public Trip addTrip(TripCreateDTO tripCreateDTO) {
        User user = userRepository.findById(tripCreateDTO.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
        Trip trip = new Trip();
        trip.setUser(user);
        trip.setDestination(tripCreateDTO.getDestination());
        trip.setStartDate(tripCreateDTO.getStartDate());
        trip.setEndDate(tripCreateDTO.getEndDate());
        return tripRepository.save(trip);
    }

    public List<Trip> getTripsByUserId(UUID userId) {
        return tripRepository.findByUserId(userId);

    }
}
