package com.nico.podium.service;

import com.nico.podium.domain.PodiumModels.Vehicle;
import com.nico.podium.domain.PodiumModels.VehicleRequest;

import java.util.List;

public interface VehicleService {
    List<Vehicle> list(Long userId);

    Vehicle get(Long userId, Long id);

    Vehicle create(Long userId, VehicleRequest request);

    Vehicle update(Long userId, Long id, VehicleRequest request);

    void delete(Long userId, Long id);
}