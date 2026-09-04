package com.nico.podium.controller;

import com.nico.podium.domain.PodiumModels.Vehicle;
import com.nico.podium.domain.PodiumModels.VehicleRequest;
import com.nico.podium.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController extends ControllerSupport {
    private final VehicleService vehicles;

    public VehicleController(VehicleService vehicles) {
        this.vehicles = vehicles;
    }

    @GetMapping
    public List<Vehicle> list() {
        return vehicles.list(userId());
    }

    @PostMapping
    public Vehicle create(@Valid @RequestBody VehicleRequest request) {
        return vehicles.create(userId(), request);
    }

    @GetMapping("/{id}")
    public Vehicle get(@PathVariable Long id) {
        return vehicles.get(userId(), id);
    }

    @PatchMapping("/{id}")
    public Vehicle update(@PathVariable Long id, @Valid @RequestBody VehicleRequest request) {
        return vehicles.update(userId(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        vehicles.delete(userId(), id);
    }
}