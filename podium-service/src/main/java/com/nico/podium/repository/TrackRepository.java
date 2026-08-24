package com.nico.podium.repository;

import com.nico.podium.domain.PodiumModels.Track;
import com.nico.podium.domain.PodiumModels.TrackConfiguration;

import java.util.List;
import java.util.Optional;

public interface TrackRepository {
    Track save(Track track);

    Optional<Track> findById(String id);

    List<Track> findByUserId(String userId);

    void deleteById(String id);

    TrackConfiguration saveConfiguration(TrackConfiguration configuration);

    List<TrackConfiguration> findConfigurations(String trackId);
}