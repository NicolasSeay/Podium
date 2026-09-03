package com.nico.podium.service;

import com.nico.podium.domain.PodiumModels.Session;
import com.nico.podium.domain.PodiumModels.SessionRequest;

import java.util.List;

public interface SessionService {
    List<Session> list(Long userId, Long trackDayId);

    Session get(Long userId, Long id);

    Session create(Long userId, Long trackDayId, SessionRequest request);

    Session update(Long userId, Long id, SessionRequest request);

    void delete(Long userId, Long id);
}