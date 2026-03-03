package org.example.travelapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import lombok.Data;

@Service
public class GeocodingService {

    private final RestTemplate restTemplate;

    @Value("${locationiq.api.key}")
    private String apiKey;

    public GeocodingService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public double[] getCoordinates(String destination) {
        String url = String.format("https://us1.locationiq.com/v1/search?key=%s&q=%s&format=json",
                apiKey, destination);

        LocationIQResponse[] response = restTemplate.getForObject(url, LocationIQResponse[].class);

        if (response != null && response.length > 0) {
            return new double[]{
                    Double.parseDouble(response[0].getLat()),
                    Double.parseDouble(response[0].getLon())
            };
        }
        return new double[]{0.0, 0.0};
    }

    @Data
    private static class LocationIQResponse {
        private String lat;
        private String lon;
    }
}