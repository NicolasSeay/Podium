package com.nico.podium.service;

import com.nico.podium.domain.PodiumModels.Lap;
import com.nico.podium.domain.PodiumModels.LapRequest;

import java.util.List;

public interface LapService {
    List<Lap> list(Long userId, Long sessionId);

    Lap get(Long userId, Long id);

    Lap create(Long userId, Long sessionId, LapRequest request);

    Lap update(Long userId, Long id, LapRequest request);

    void delete(Long userId, Long id);
}