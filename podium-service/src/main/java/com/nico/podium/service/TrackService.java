package com.nico.podium.service;

import com.nico.podium.domain.PodiumModels.Track;
import com.nico.podium.domain.PodiumModels.TrackConfiguration;

import java.util.List;
import java.util.Map;

public interface TrackService {
    List<Track> list(Long userId);

    Track get(Long userId, Long id);

    Track create(Long userId, Map<String, Object> body);

    Track update(Long userId, Long id, Map<String, Object> body);

    void delete(Long userId, Long id);

    List<TrackConfiguration> configurations(Long userId, Long trackId);

    TrackConfiguration createConfiguration(Long userId, Long trackId, Map<String, Object> body);
}