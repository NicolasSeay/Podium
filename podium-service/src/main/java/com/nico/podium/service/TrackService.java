package com.nico.podium.service;

import com.nico.podium.domain.PodiumModels.Track;
import com.nico.podium.domain.PodiumModels.TrackConfiguration;

import java.util.List;
import java.util.Map;

public interface TrackService {
    List<Track> list(String userId);

    Track get(String userId, String id);

    Track create(String userId, Map<String, Object> body);

    Track update(String userId, String id, Map<String, Object> body);

    void delete(String userId, String id);

    List<TrackConfiguration> configurations(String userId, String trackId);

    TrackConfiguration createConfiguration(String userId, String trackId, Map<String, Object> body);
}