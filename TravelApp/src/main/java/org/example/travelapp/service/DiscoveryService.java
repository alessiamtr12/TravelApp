package org.example.travelapp.service;

import org.example.travelapp.model.HotelDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DiscoveryService {

    private final RestTemplate restTemplate;

    public DiscoveryService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<HotelDTO> findNearbyHotels(Double lat, Double lon) {
        String query = String.format("[out:json];nwr(around:5000,%f,%f)[tourism=hotel];out center;", lat, lon);

        try {
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
            URI uri = new URI("https://overpass-api.de/api/interpreter?data=" + encodedQuery);

            Map<String, Object> response = restTemplate.getForObject(uri, Map.class);
            List<HotelDTO> hotels = new ArrayList<>();

            if (response != null && response.containsKey("elements")) {
                List<Map<String, Object>> elements = (List<Map<String, Object>>) response.get("elements");
                for (Map<String, Object> element : elements) {
                    Map<String, Object> tags = (Map<String, Object>) element.get("tags");
                    String name = (tags != null && tags.containsKey("name")) ? (String) tags.get("name") : "Unnamed Hotel";
                    Double hLat, hLon;
                    if (element.containsKey("center")) {
                        Map<String, Object> center = (Map<String, Object>) element.get("center");
                        hLat = ((Number) center.get("lat")).doubleValue();
                        hLon = ((Number) center.get("lon")).doubleValue();
                    } else {
                        hLat = ((Number) element.get("lat")).doubleValue();
                        hLon = ((Number) element.get("lon")).doubleValue();
                    }
                    hotels.add(new HotelDTO(name, hLat, hLon));
                }
            }
            return hotels;

        } catch (Exception e) {
            System.err.println("Discovery Error: " + e.getMessage());
            return new ArrayList<>();
        }
    }
}