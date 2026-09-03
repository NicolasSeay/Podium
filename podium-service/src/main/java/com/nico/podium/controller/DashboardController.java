package com.nico.podium.controller;

import com.nico.podium.domain.PodiumModels.DashboardResponse;
import com.nico.podium.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController extends ControllerSupport {
    private final DashboardService dashboard;

    public DashboardController(DashboardService dashboard) {
        this.dashboard = dashboard;
    }

    @GetMapping
    public DashboardResponse get(@RequestParam(required = false) Long trackId,
                                 @RequestParam(required = false) Long vehicleId) {
        return dashboard.get(userId(), trackId, vehicleId);
    }
}