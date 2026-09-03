package com.nico.podium.service;

import com.nico.podium.domain.PodiumModels.Track;
import com.nico.podium.domain.PodiumModels.TrackRequest;

import java.util.List;

public interface TrackService {
    List<Track> list(Long userId);

    Track get(Long userId, Long id);

    Track create(Long userId, TrackRequest request);

    Track update(Long userId, Long id, TrackRequest request);

    void delete(Long userId, Long id);
}