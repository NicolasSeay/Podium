package com.nico.podium.controller;

import com.nico.podium.domain.PodiumModels.*;
import com.nico.podium.service.TrackService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracks")
public class TrackController extends ControllerSupport {
    private final TrackService tracks;

    public TrackController(TrackService tracks) {
        this.tracks = tracks;
    }

    @GetMapping
    public List<Track> list() {
        return tracks.list(userId());
    }

    @PostMapping
    public Track create(@RequestBody TrackRequest request) {
        return tracks.create(userId(), request);
    }

    @GetMapping("/{id}")
    public TrackDetailsResponse get(@PathVariable Long id) {
        Long userId = userId();
        return new TrackDetailsResponse(tracks.get(userId, id), tracks.configurations(userId, id));
    }

    @PatchMapping("/{id}")
    public Track update(@PathVariable Long id, @RequestBody TrackRequest request) {
        return tracks.update(userId(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        tracks.delete(userId(), id);
    }

    @GetMapping("/{id}/configurations")
    public List<TrackConfiguration> configurations(@PathVariable Long id) {
        return tracks.configurations(userId(), id);
    }

    @PostMapping("/{id}/configurations")
    public TrackConfiguration createConfiguration(@PathVariable Long id,
                                                  @RequestBody TrackConfigurationRequest request) {
        return tracks.createConfiguration(userId(), id, request);
    }
}