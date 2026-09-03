package com.nico.podium.repository.jpa;

import com.nico.podium.domain.entity.TrackConfigurationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrackConfigurationJpaRepository extends JpaRepository<TrackConfigurationEntity, Long> {
    List<TrackConfigurationEntity> findByTrackId(Long trackId);
}
