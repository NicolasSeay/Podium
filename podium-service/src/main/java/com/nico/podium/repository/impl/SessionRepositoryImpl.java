package com.nico.podium.repository.impl;

import com.nico.podium.domain.PodiumModels.Session;
import com.nico.podium.domain.entity.SessionEntity;
import com.nico.podium.repository.SessionRepository;
import com.nico.podium.repository.jpa.SessionJpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class SessionRepositoryImpl implements SessionRepository {
    private final SessionJpaRepository repository;

    public SessionRepositoryImpl(SessionJpaRepository repository) {
        this.repository = repository;
    }

    public Session save(Session value) {
        return repository.save(new SessionEntity(value)).toDomain();
    }

    public Optional<Session> findById(String id) {
        return repository.findById(id).map(SessionEntity::toDomain);
    }

    public List<Session> findByTrackDayId(String trackDayId) {
        return repository.findByTrackDayId(trackDayId).stream()
                .map(SessionEntity::toDomain)
                .toList();
    }

    public void deleteById(String id) {
        repository.deleteById(id);
    }
}