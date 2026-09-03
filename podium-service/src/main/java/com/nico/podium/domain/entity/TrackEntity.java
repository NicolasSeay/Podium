package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.Track;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "tracks")
public class TrackEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String city;
    private String country;
    private BigDecimal lengthMiles;

    protected TrackEntity() {
    }

    public TrackEntity(Track track) {
        id = track.id();
        name = track.name();
        city = track.city();
        country = track.country();
        lengthMiles = track.lengthMiles();
    }

    public Track toDomain() {
        return new Track(id, name, city, country, lengthMiles);
    }

    public Long getId() {
        return id;
    }

}
