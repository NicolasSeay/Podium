package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.Vehicle;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vehicles")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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

}
