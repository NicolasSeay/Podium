package com.nico.podium.controller;

import com.nico.podium.domain.PodiumModels.Track;
import com.nico.podium.domain.PodiumModels.TrackConfiguration;
import com.nico.podium.service.AuthService;
import com.nico.podium.service.TrackService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tracks")
public class TrackController extends ControllerSupport {
    private final TrackService tracks;

    public TrackController(AuthService auth, TrackService tracks) {
        super(auth);
        this.tracks = tracks;
    }

    @GetMapping
    public List<Track> list(@RequestHeader(value = "Authorization", required = false) String a, @RequestHeader(value = "X-User-Id", required = false) String h) {
        return tracks.list(userId(a, h));
    }

    @PostMapping
    public Track create(@RequestHeader(value = "Authorization", required = false) String a, @RequestHeader(value = "X-User-Id", required = false) String h, @RequestBody Map<String, Object> b) {
        return tracks.create(userId(a, h), b);
    }

    @GetMapping("/{id}")
    public Map<String, Object> get(@PathVariable String id, @RequestHeader(value = "Authorization", required = false) String a, @RequestHeader(value = "X-User-Id", required = false) String h) {
        String u = userId(a, h);
        return Map.of("track", tracks.get(u, id), "configurations", tracks.configurations(u, id));
    }

    @PatchMapping("/{id}")
    public Track update(@PathVariable String id, @RequestHeader(value = "Authorization", required = false) String a, @RequestHeader(value = "X-User-Id", required = false) String h, @RequestBody Map<String, Object> b) {
        return tracks.update(userId(a, h), id, b);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id, @RequestHeader(value = "Authorization", required = false) String a, @RequestHeader(value = "X-User-Id", required = false) String h) {
        tracks.delete(userId(a, h), id);
    }

    @GetMapping("/{id}/configurations")
    public List<TrackConfiguration> configurations(@PathVariable String id, @RequestHeader(value = "Authorization", required = false) String a, @RequestHeader(value = "X-User-Id", required = false) String h) {
        return tracks.configurations(userId(a, h), id);
    }

    @PostMapping("/{id}/configurations")
    public TrackConfiguration createConfiguration(@PathVariable String id, @RequestHeader(value = "Authorization", required = false) String a, @RequestHeader(value = "X-User-Id", required = false) String h, @RequestBody Map<String, Object> b) {
        return tracks.createConfiguration(userId(a, h), id, b);
    }
}