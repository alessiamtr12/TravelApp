package org.example.travelapp.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class TripCreateDTO {
    private String destination;
    private String startDate;
    private String endDate;
    private UUID userId;
    private String hotelName;
    private Double hotelLatitude;
    private Double hotelLongitude;
}
