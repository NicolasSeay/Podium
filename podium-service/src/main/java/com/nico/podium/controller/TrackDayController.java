package com.nico.podium.controller;

import com.nico.podium.domain.PodiumModels.*;
import com.nico.podium.service.TrackDayService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/track-days")
public class TrackDayController extends ControllerSupport {
    private final TrackDayService days;

    public TrackDayController(TrackDayService days) {
        this.days = days;
    }

    @GetMapping
    public List<CompletedTrackDay> list(@RequestParam(required = false) Long trackId, @RequestParam(required = false) Long vehicleId, @RequestParam(required = false) LocalDate from, @RequestParam(required = false) LocalDate to) {
        return days.list(userId(), trackId, vehicleId, from, to);
    }

    @GetMapping("/stats")
    public List<TrackDayStats> stats() {
        return days.stats(userId());
    }

    @PostMapping
    public CompletedTrackDay create(@Valid @RequestBody TrackDayRequest request) {
        return days.create(userId(), request);
    }

    @GetMapping("/{id:\\d+}")
    public CompletedTrackDay get(@PathVariable Long id) {
        return days.details(userId(), id);
    }

}