package com.nico.podium.controller;

import com.nico.podium.domain.PodiumModels.*;
import com.nico.podium.service.TrackService;
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
        return tracks.list();
    }

    // Reserved until the Angular app has a track detail workflow.
    // @GetMapping("/{id}")
    public Track get(@PathVariable Long id) {
        return tracks.get(id);
    }

}