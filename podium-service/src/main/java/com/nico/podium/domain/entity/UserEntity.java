package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.User;
import com.nico.podium.domain.PodiumModels.DistanceUnit;
import com.nico.podium.domain.PodiumModels.TemperatureUnit;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String password;
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;
    @Enumerated(EnumType.STRING)
    @Column(name = "distance_unit", nullable = false)
    private DistanceUnit distanceUnit;
    @Enumerated(EnumType.STRING)
    @Column(name = "temperature_unit", nullable = false)
    private TemperatureUnit temperatureUnit;
    @Column(name = "default_track_id")
    private Long defaultTrackId;
    @Column(name = "default_vehicle_id")
    private Long defaultVehicleId;

    public UserEntity(User user) {
        id = user.id();
        email = user.email();
        password = user.password();
        firstName = user.firstName();
        lastName = user.lastName();
        distanceUnit = user.distanceUnit();
        temperatureUnit = user.temperatureUnit();
        defaultTrackId = user.defaultTrackId();
        defaultVehicleId = user.defaultVehicleId();
    }

    public User toDomain() {
        return new User(id, email, password, firstName, lastName,
            distanceUnit == null ? DistanceUnit.MILES : distanceUnit,
            temperatureUnit == null ? TemperatureUnit.FAHRENHEIT : temperatureUnit,
            defaultTrackId, defaultVehicleId);
    }

}
