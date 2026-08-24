package com.nico.podium.controller;

import com.nico.podium.service.AuthService;
import com.nico.podium.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController extends ControllerSupport {
    private final DashboardService dashboard;

    public DashboardController(AuthService auth, DashboardService dashboard) {
        super(auth);
        this.dashboard = dashboard;
    }

    @GetMapping
    public Map<String, Object> get(@RequestHeader(value = "Authorization", required = false) String a, @RequestHeader(value = "X-User-Id", required = false) String h) {
        return dashboard.get(userId(a, h));
    }
}