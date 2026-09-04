package com.nico.podium.service.impl;

import com.nico.podium.domain.PodiumModels.Track;
import com.nico.podium.repository.TrackRepository;
import com.nico.podium.service.TrackService;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.nico.podium.service.impl.ServiceSupportImpl.missing;

@Service
public class TrackServiceImpl implements TrackService {
    private final TrackRepository tracks;

    public TrackServiceImpl(TrackRepository tracks) {
        this.tracks = tracks;
    }

    public List<Track> list() {
        return tracks.findAll();
    }

    public Track get(Long id) {
        return tracks.findById(id).orElseThrow(() -> missing("track"));
    }

}