package com.nico.podium.repository;

import com.nico.podium.domain.PodiumModels.Lap;

import java.util.List;
import java.util.Optional;

public interface LapRepository {
    Lap save(Lap lap);

    Optional<Lap> findById(String id);

    List<Lap> findBySessionId(String sessionId);

    void deleteById(String id);
}