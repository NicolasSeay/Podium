package com.nico.podium.service;

import com.nico.podium.domain.PodiumModels.CompletedTrackDay;
import com.nico.podium.domain.PodiumModels.TrackDay;
import com.nico.podium.domain.PodiumModels.TrackDayRequest;
import com.nico.podium.domain.PodiumModels.TrackDayStats;

import java.time.LocalDate;
import java.util.List;

public interface TrackDayService {
    List<TrackDay> list(Long userId, Long trackId, Long vehicleId, LocalDate from, LocalDate to);

    List<TrackDayStats> stats(Long userId);

    TrackDay get(Long userId, Long id);

    TrackDay create(Long userId, TrackDayRequest request);

    CompletedTrackDay complete(Long userId, TrackDayRequest request);

    TrackDay update(Long userId, Long id, TrackDayRequest request);

    void delete(Long userId, Long id);
}