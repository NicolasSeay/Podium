package com.nico.podium.repository;

import com.nico.podium.domain.PodiumModels.Vehicle;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository {
    Vehicle save(Vehicle vehicle);

    Optional<Vehicle> findById(String id);

    List<Vehicle> findByUserId(String userId);

    void deleteById(String id);
}