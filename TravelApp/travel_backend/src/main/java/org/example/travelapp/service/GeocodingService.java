package org.example.travelapp.service;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Service
public class GeocodingService {

    private final RestTemplate restTemplate;


    public GeocodingService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public double[] getCoordinates(String destination) {
        String url = "https://nominatim.openstreetmap.org/search?format=json&q=" + destination;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "TravelApp");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);
            List<Map<String, Object>> results = response.getBody();

            if (results != null && !results.isEmpty()) {
                Map<String, Object> firstResult = results.get(0);
                double lat = Double.parseDouble((String) firstResult.get("lat"));
                double lon = Double.parseDouble((String) firstResult.get("lon"));
                return new double[]{lat, lon};
            }
        } catch (Exception e) {
            System.err.println("Geocoding Error: " + e.getMessage());
        }
        return new double[]{48.8566, 2.3522};
    }
}