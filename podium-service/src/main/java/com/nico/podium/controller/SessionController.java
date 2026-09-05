package com.nico.podium.controller;

import com.nico.podium.domain.PodiumModels.*;
import com.nico.podium.service.LapService;
import com.nico.podium.service.SessionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController extends ControllerSupport {
    private final SessionService sessions;
    private final LapService laps;

    public SessionController(SessionService sessions, LapService laps) {
        this.sessions = sessions;
        this.laps = laps;
    }

    // Reserved until the Angular app has a standalone session detail workflow.
    // @GetMapping("/{id}")
    public SessionDetailsResponse get(@PathVariable Long id) {
        Long userId = userId();
        return new SessionDetailsResponse(sessions.get(userId, id), laps.list(userId, id));
    }

    // Reserved until session editing is available in the Angular app.
    // @PatchMapping("/{id}")
    public Session update(@PathVariable Long id, @Valid @RequestBody SessionRequest request) {
        return sessions.update(userId(), id, request);
    }

    // Reserved until session deletion is available in the Angular app.
    // @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        sessions.delete(userId(), id);
    }

    @GetMapping("/{id}/laps")
    public List<Lap> listLaps(@PathVariable Long id) {
        return laps.list(userId(), id);
    }

    @PostMapping("/{id}/laps")
    public Lap createLap(@PathVariable Long id, @Valid @RequestBody LapRequest request) {
        return laps.create(userId(), id, request);
    }
}