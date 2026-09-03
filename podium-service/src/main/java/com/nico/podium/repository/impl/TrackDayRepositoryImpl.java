package com.nico.podium.repository.impl;

import com.nico.podium.domain.PodiumModels.TrackDay;
import com.nico.podium.domain.entity.TrackDayEntity;
import com.nico.podium.repository.TrackDayRepository;
import com.nico.podium.repository.jpa.TrackDayJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class TrackDayRepositoryImpl implements TrackDayRepository {
    private final TrackDayJpaRepository repository;

    public TrackDayRepositoryImpl(TrackDayJpaRepository repository) {
        this.repository = repository;
    }

    public TrackDay save(TrackDay value) {
        return repository.save(new TrackDayEntity(value)).toDomain();
    }

    public Optional<TrackDay> findById(Long id) {
        return repository.findById(id).map(TrackDayEntity::toDomain);
    }

    public List<TrackDay> findByUserId(Long userId) {
        return repository.findByUserId(userId).stream()
                .map(TrackDayEntity::toDomain)
                .toList();
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}