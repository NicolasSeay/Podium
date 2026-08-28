package com.nico.podium.repository.impl;

import com.nico.podium.domain.PodiumModels.Vehicle;
import com.nico.podium.domain.entity.VehicleEntity;
import com.nico.podium.repository.VehicleRepository;
import com.nico.podium.repository.jpa.VehicleJpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class VehicleRepositoryImpl implements VehicleRepository {
    private final VehicleJpaRepository repository;

    public VehicleRepositoryImpl(VehicleJpaRepository repository) {
        this.repository = repository;
    }

    public Vehicle save(Vehicle value) {
        return repository.save(new VehicleEntity(value)).toDomain();
    }

    public Optional<Vehicle> findById(Long id) {
        return repository.findById(id).map(VehicleEntity::toDomain);
    }

    public List<Vehicle> findByUserId(Long userId) {
        return repository.findByUserId(userId).stream()
                .map(VehicleEntity::toDomain)
                .toList();
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}