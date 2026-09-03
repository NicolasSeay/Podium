package com.nico.podium.controller;

import com.nico.podium.domain.PodiumModels.*;
import com.nico.podium.service.SessionService;
import com.nico.podium.service.TrackDayService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/track-days")
public class TrackDayController extends ControllerSupport {
    private final TrackDayService days;
    private final SessionService sessions;

    public TrackDayController(TrackDayService days, SessionService sessions) {
        this.days = days;
        this.sessions = sessions;
    }

    @GetMapping
    public List<TrackDay> list(@RequestParam(required = false) Long trackId, @RequestParam(required = false) Long vehicleId, @RequestParam(required = false) LocalDate from, @RequestParam(required = false) LocalDate to) {
        return days.list(userId(), trackId, vehicleId, from, to);
    }

    @GetMapping("/stats")
    public List<TrackDayStats> stats() {
        return days.stats(userId());
    }

    @PostMapping
    public TrackDay create(@RequestBody TrackDayRequest request) {
        return days.create(userId(), request);
    }

    @PostMapping("/complete")
    public CompletedTrackDay complete(@RequestBody TrackDayRequest request) {
        return days.complete(userId(), request);
    }

    @GetMapping("/{id:\\d+}")
    public TrackDayDetailsResponse get(@PathVariable Long id) {
        Long userId = userId();
        return new TrackDayDetailsResponse(days.get(userId, id), sessions.list(userId, id));
    }

    @PatchMapping("/{id:\\d+}")
    public TrackDay update(@PathVariable Long id, @RequestBody TrackDayRequest request) {
        return days.update(userId(), id, request);
    }

    @DeleteMapping("/{id:\\d+}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        days.delete(userId(), id);
    }

    @GetMapping("/{id:\\d+}/sessions")
    public List<Session> listSessions(@PathVariable Long id) {
        return sessions.list(userId(), id);
    }

    @PostMapping("/{id:\\d+}/sessions")
    public Session createSession(@PathVariable Long id, @RequestBody SessionRequest request) {
        return sessions.create(userId(), id, request);
    }
}