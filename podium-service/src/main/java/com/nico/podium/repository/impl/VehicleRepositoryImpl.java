package com.nico.podium.repository.impl;

import com.nico.podium.domain.PodiumModels.Vehicle;
import com.nico.podium.repository.VehicleRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class VehicleRepositoryImpl implements VehicleRepository {
    private final InMemoryDataStoreImpl store;
    public VehicleRepositoryImpl(InMemoryDataStoreImpl store) { this.store = store; }
    public Vehicle save(Vehicle value) { store.vehicles.put(value.id(), value); return value; }
    public Optional<Vehicle> findById(String id) { return Optional.ofNullable(store.vehicles.get(id)); }
    public List<Vehicle> findByUserId(String userId) { return store.vehicles.values().stream().filter(value -> value.userId().equals(userId)).toList(); }
    public void deleteById(String id) { store.vehicles.remove(id); }
}