package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.Track;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;

@Entity
@Table(name = "tracks")
public class TrackEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String name;
    private String location;

    protected TrackEntity() {
    }

    public TrackEntity(Track track) {
        id = track.id();
        userId = track.userId();
        name = track.name();
        location = track.location();
    }

    public Track toDomain() {
        return new Track(id, userId, name, location);
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }
}
