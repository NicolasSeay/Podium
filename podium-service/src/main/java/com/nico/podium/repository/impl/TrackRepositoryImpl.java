package com.nico.podium.repository.impl;

import com.nico.podium.domain.PodiumModels.*;
import com.nico.podium.domain.entity.TrackConfigurationEntity;
import com.nico.podium.domain.entity.TrackEntity;
import com.nico.podium.repository.TrackRepository;
import com.nico.podium.repository.jpa.TrackConfigurationJpaRepository;
import com.nico.podium.repository.jpa.TrackJpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class TrackRepositoryImpl implements TrackRepository {
    private final TrackJpaRepository tracks;
    private final TrackConfigurationJpaRepository configurations;

    public TrackRepositoryImpl(TrackJpaRepository tracks, TrackConfigurationJpaRepository configurations) {
        this.tracks = tracks;
        this.configurations = configurations;
    }

    public Track save(Track value) {
        return tracks.save(new TrackEntity(value)).toDomain();
    }

    public Optional<Track> findById(Long id) {
        return tracks.findById(id).map(TrackEntity::toDomain);
    }

    public List<Track> findAll() {
        return tracks.findAll().stream()
                .map(TrackEntity::toDomain)
                .toList();
    }

    public void deleteById(Long id) {
        tracks.deleteById(id);
    }

    public TrackConfiguration saveConfiguration(TrackConfiguration value) {
        return configurations.save(new TrackConfigurationEntity(value)).toDomain();
    }

    public List<TrackConfiguration> findConfigurations(Long trackId) {
        return configurations.findByTrackId(trackId).stream()
                .map(TrackConfigurationEntity::toDomain)
                .toList();
    }
}