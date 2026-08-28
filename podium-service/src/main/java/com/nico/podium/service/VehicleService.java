package com.nico.podium.service;

import com.nico.podium.domain.PodiumModels.Vehicle;

import java.util.List;
import java.util.Map;

public interface VehicleService {
    List<Vehicle> list(Long userId);

    Vehicle get(Long userId, Long id);

    Vehicle create(Long userId, Map<String, Object> body);

    Vehicle update(Long userId, Long id, Map<String, Object> body);

    void delete(Long userId, Long id);
}