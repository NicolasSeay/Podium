package com.nico.podium.service.impl;

import com.nico.podium.domain.PodiumModels.Track;
import com.nico.podium.domain.PodiumModels.TrackConfiguration;
import com.nico.podium.domain.PodiumModels.TrackConfigurationRequest;
import com.nico.podium.domain.PodiumModels.TrackRequest;
import com.nico.podium.repository.TrackRepository;
import com.nico.podium.service.TrackService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.nico.podium.service.impl.ServiceSupportImpl.error;
import static com.nico.podium.service.impl.ServiceSupportImpl.missing;

@Service
public class TrackServiceImpl implements TrackService {
    private final TrackRepository tracks;

    public TrackServiceImpl(TrackRepository tracks) {
        this.tracks = tracks;
    }

    public List<Track> list(Long userId) {
        return tracks.findAll();
    }

    public Track get(Long userId, Long id) {
        return tracks.findById(id).orElseThrow(() -> missing("track"));
    }

    public Track create(Long userId, TrackRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            throw error(HttpStatus.BAD_REQUEST, "name is required");
        }
        return tracks.save(new Track(null, request.name(), request.city(), request.country(), request.lengthMiles()));
    }

    public Track update(Long userId, Long id, TrackRequest request) {
        Track c = get(userId, id);
        return tracks.save(new Track(c.id(), request.name() == null ? c.name() : request.name(), request.city() == null ? c.city() : request.city(), request.country() == null ? c.country() : request.country(), request.lengthMiles() == null ? c.lengthMiles() : request.lengthMiles()));
    }

    public void delete(Long userId, Long id) {
        get(userId, id);
        tracks.deleteById(id);
    }

    public List<TrackConfiguration> configurations(Long userId, Long trackId) {
        get(userId, trackId);
        return tracks.findConfigurations(trackId);
    }

    public TrackConfiguration createConfiguration(Long userId, Long trackId, TrackConfigurationRequest request) {
        get(userId, trackId);
        if (request.name() == null || request.name().isBlank()) {
            throw error(HttpStatus.BAD_REQUEST, "name is required");
        }
        return tracks.saveConfiguration(new TrackConfiguration(null, trackId, request.name(), request.lengthMeters()));
    }
}