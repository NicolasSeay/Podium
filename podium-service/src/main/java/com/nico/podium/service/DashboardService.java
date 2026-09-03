package com.nico.podium.service;

import com.nico.podium.domain.PodiumModels.DashboardResponse;

public interface DashboardService {
    DashboardResponse get(Long userId, Long trackId, Long vehicleId);
}