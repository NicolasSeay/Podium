package com.nico.podium.service;

import com.nico.podium.domain.PodiumModels.Track;

import java.util.List;

public interface TrackService {
    List<Track> list();

    Track get(Long id);
}