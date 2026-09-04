package com.nico.podium.repository;

import com.nico.podium.domain.PodiumModels.Track;

import java.util.List;
import java.util.Optional;

public interface TrackRepository {
    Optional<Track> findById(Long id);

    List<Track> findAll();

}