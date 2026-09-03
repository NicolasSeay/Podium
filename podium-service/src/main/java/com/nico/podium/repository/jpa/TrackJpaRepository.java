package com.nico.podium.repository.jpa;

import com.nico.podium.domain.entity.TrackEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrackJpaRepository extends JpaRepository<TrackEntity, Long> {
}
