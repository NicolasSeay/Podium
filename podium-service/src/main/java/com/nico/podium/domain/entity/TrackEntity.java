package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.Track;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "tracks")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TrackEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String city;
    private String country;
    private BigDecimal lengthMiles;

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

}
