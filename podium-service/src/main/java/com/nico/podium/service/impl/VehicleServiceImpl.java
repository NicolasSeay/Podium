package com.nico.podium.service.impl;

import com.nico.podium.domain.PodiumModels.Vehicle;
import com.nico.podium.domain.PodiumModels.VehicleRequest;
import com.nico.podium.repository.VehicleRepository;
import com.nico.podium.service.VehicleService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.nico.podium.service.impl.ServiceSupportImpl.error;
import static com.nico.podium.service.impl.ServiceSupportImpl.missing;

@Service
public class VehicleServiceImpl implements VehicleService {
    private final VehicleRepository vehicles;

    public VehicleServiceImpl(VehicleRepository vehicles) {
        this.vehicles = vehicles;
    }

    public List<Vehicle> list(Long userId) {
        return vehicles.findByUserId(userId);
    }

    public Vehicle get(Long userId, Long id) {
        Vehicle v = vehicles.findById(id).orElseThrow(() -> missing("vehicle"));
        if (!v.userId().equals(userId)) {
            throw missing("vehicle");
        }
        return v;
    }

    public Vehicle create(Long userId, VehicleRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            throw error(HttpStatus.BAD_REQUEST, "name is required");
        }
        return vehicles.save(new Vehicle(null, userId, request.name(), request.make(), request.model(),
                request.trim(), request.year()));
    }

    public Vehicle update(Long userId, Long id, VehicleRequest request) {
        Vehicle currentVehicle = get(userId, id);
        String name = request.name() == null ? currentVehicle.name() : request.name();
        String make = request.make() == null ? currentVehicle.make() : request.make();
        String model = request.model() == null ? currentVehicle.model() : request.model();
        String trim = request.trim() == null ? currentVehicle.trim() : request.trim();
        Integer year = request.year() == null ? currentVehicle.year() : request.year();
        Vehicle updatedVehicle = new Vehicle(currentVehicle.id(), currentVehicle.userId(), name, make, model, trim,
                year);
        return vehicles.save(updatedVehicle);
    }

    public void delete(Long userId, Long id) {
        get(userId, id);
        vehicles.deleteById(id);
    }
}