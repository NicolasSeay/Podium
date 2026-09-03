package com.nico.podium.controller;

import com.nico.podium.domain.PodiumModels.Lap;
import com.nico.podium.domain.PodiumModels.LapRequest;
import com.nico.podium.service.LapService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/laps")
public class LapController extends ControllerSupport {
    private final LapService laps;

    public LapController(LapService laps) {
        this.laps = laps;
    }

    @PatchMapping("/{id}")
    public Lap update(@PathVariable Long id, @RequestBody LapRequest request) {
        return laps.update(userId(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        laps.delete(userId(), id);
    }
}