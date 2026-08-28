package com.nico.podium.repository;

import com.nico.podium.domain.PodiumModels.Session;

import java.util.List;
import java.util.Optional;

public interface SessionRepository {
    Session save(Session session);

    Optional<Session> findById(Long id);

    List<Session> findByTrackDayId(Long trackDayId);

    void deleteById(Long id);
}