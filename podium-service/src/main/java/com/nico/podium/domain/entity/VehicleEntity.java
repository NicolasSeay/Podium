package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.Vehicle;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

@Entity
@Table(name = "vehicles")
public class VehicleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String name;
    private String make;
    private String model;
    private String trim;
    @Column(name = "vehicle_year")
    private Integer year;

    protected VehicleEntity() {
    }

    public VehicleEntity(Vehicle vehicle) {
        id = vehicle.id();
        userId = vehicle.userId();
        name = vehicle.name();
        make = vehicle.make();
        model = vehicle.model();
        trim = vehicle.trim();
        year = vehicle.year();
    }

    public Vehicle toDomain() {
        return new Vehicle(id, userId, name, make, model, trim, year);
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }
}
