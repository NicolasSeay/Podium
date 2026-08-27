package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.Vehicle;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;

@Entity
@Table(name = "vehicles")
public class VehicleEntity {
    @Id
    private String id;
    private String userId;
    private String name;
    private String make;
    private String model;
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
        year = vehicle.year();
    }

    public Vehicle toDomain() {
        return new Vehicle(id, userId, name, make, model, year);
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }
}
