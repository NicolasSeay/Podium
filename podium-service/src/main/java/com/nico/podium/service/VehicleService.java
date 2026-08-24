package com.nico.podium.service;

import com.nico.podium.domain.PodiumModels.Vehicle;

import java.util.List;
import java.util.Map;

public interface VehicleService {
    List<Vehicle> list(String userId);

    Vehicle get(String userId, String id);

    Vehicle create(String userId, Map<String, Object> body);

    Vehicle update(String userId, String id, Map<String, Object> body);

    void delete(String userId, String id);
}