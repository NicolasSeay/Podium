package com.nico.podium.repository.impl;

import com.nico.podium.domain.PodiumModels.Lap;
import com.nico.podium.domain.entity.LapEntity;
import com.nico.podium.repository.LapRepository;
import com.nico.podium.repository.jpa.LapJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class LapRepositoryImpl implements LapRepository {
    private final LapJpaRepository repository;

    public LapRepositoryImpl(LapJpaRepository repository) {
        this.repository = repository;
    }

    public Lap save(Lap value) {
        return repository.save(new LapEntity(value)).toDomain();
    }

    public Optional<Lap> findById(Long id) {
        return repository.findById(id).map(LapEntity::toDomain);
    }

    public List<Lap> findBySessionId(Long sessionId) {
        return repository.findBySessionId(sessionId).stream()
                .map(LapEntity::toDomain)
                .toList();
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}