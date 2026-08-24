package com.nico.podium.repository;

import com.nico.podium.domain.PodiumModels.TrackDay;

import java.util.List;
import java.util.Optional;

public interface TrackDayRepository {
    TrackDay save(TrackDay trackDay);

    Optional<TrackDay> findById(String id);

    List<TrackDay> findByUserId(String userId);

    void deleteById(String id);
}