package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.TrackConfiguration;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "track_configurations")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TrackConfigurationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long trackId;
    private String name;
    private Integer lengthMeters;

    public TrackConfigurationEntity(TrackConfiguration configuration) {
        id = configuration.id();
        trackId = configuration.trackId();
        name = configuration.name();
        lengthMeters = configuration.lengthMeters();
    }

    public TrackConfiguration toDomain() {
        return new TrackConfiguration(id, trackId, name, lengthMeters);
    }

}
