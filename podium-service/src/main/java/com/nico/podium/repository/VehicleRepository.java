package com.nico.podium.repository;

import com.nico.podium.domain.PodiumModels.Vehicle;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository {
    Vehicle save(Vehicle vehicle);

    Optional<Vehicle> findById(Long id);

    List<Vehicle> findByUserId(Long userId);

    void deleteById(Long id);
}