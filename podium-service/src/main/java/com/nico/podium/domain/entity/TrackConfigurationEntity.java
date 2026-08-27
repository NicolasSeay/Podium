package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.TrackConfiguration;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "track_configurations")
public class TrackConfigurationEntity {
    @Id
    private String id;
    private String trackId;
    private String name;
    private Integer lengthMeters;

    protected TrackConfigurationEntity() {
    }

    public TrackConfigurationEntity(TrackConfiguration configuration) {
        id = configuration.id();
        trackId = configuration.trackId();
        name = configuration.name();
        lengthMeters = configuration.lengthMeters();
    }

    public TrackConfiguration toDomain() {
        return new TrackConfiguration(id, trackId, name, lengthMeters);
    }

    public String getId() {
        return id;
    }

    public String getTrackId() {
        return trackId;
    }
}
