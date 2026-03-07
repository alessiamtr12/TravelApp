package org.example.travelapp.model;

import lombok.Data;

import java.util.UUID;

@Data
public class TripCreateDTO {
    private String destination;
    private String startDate;
    private String endDate;
    private UUID userId;
}
