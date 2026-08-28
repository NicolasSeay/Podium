package com.nico.podium.controller;

import com.nico.podium.domain.PodiumModels.Vehicle;
import com.nico.podium.service.AuthService;
import com.nico.podium.service.VehicleService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController extends ControllerSupport {
    private final VehicleService vehicles;

    public VehicleController(AuthService auth, VehicleService vehicles) {
        super(auth);
        this.vehicles = vehicles;
    }

    @GetMapping
    public List<Vehicle> list(@RequestHeader(value = "Authorization", required = false) String a, @RequestHeader(value = "X-User-Id", required = false) String h) {
        return vehicles.list(userId(a, h));
    }

    @PostMapping
    public Vehicle create(@RequestHeader(value = "Authorization", required = false) String a, @RequestHeader(value = "X-User-Id", required = false) String h, @RequestBody Map<String, Object> b) {
        return vehicles.create(userId(a, h), b);
    }

    @GetMapping("/{id}")
    public Vehicle get(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String a, @RequestHeader(value = "X-User-Id", required = false) String h) {
        return vehicles.get(userId(a, h), id);
    }

    @PatchMapping("/{id}")
    public Vehicle update(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String a, @RequestHeader(value = "X-User-Id", required = false) String h, @RequestBody Map<String, Object> b) {
        return vehicles.update(userId(a, h), id, b);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String a, @RequestHeader(value = "X-User-Id", required = false) String h) {
        vehicles.delete(userId(a, h), id);
    }
}