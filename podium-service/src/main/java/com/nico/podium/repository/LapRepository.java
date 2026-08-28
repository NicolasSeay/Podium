package com.nico.podium.repository;

import com.nico.podium.domain.PodiumModels.Lap;

import java.util.List;
import java.util.Optional;

public interface LapRepository {
    Lap save(Lap lap);

    Optional<Lap> findById(Long id);

    List<Lap> findBySessionId(Long sessionId);

    void deleteById(Long id);
}