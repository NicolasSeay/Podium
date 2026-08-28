package com.nico.podium.repository;

import com.nico.podium.domain.PodiumModels.Track;
import com.nico.podium.domain.PodiumModels.TrackConfiguration;

import java.util.List;
import java.util.Optional;

public interface TrackRepository {
    Track save(Track track);

    Optional<Track> findById(Long id);

    List<Track> findByUserId(Long userId);

    void deleteById(Long id);

    TrackConfiguration saveConfiguration(TrackConfiguration configuration);

    List<TrackConfiguration> findConfigurations(Long trackId);
}