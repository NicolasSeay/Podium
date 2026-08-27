package com.nico.podium.repository.jpa;

import com.nico.podium.domain.entity.TrackEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrackJpaRepository extends JpaRepository<TrackEntity, String> {
    List<TrackEntity> findByUserId(String userId);
}
