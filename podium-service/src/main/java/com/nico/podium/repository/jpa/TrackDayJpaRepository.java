package com.nico.podium.repository.jpa;

import com.nico.podium.domain.entity.TrackDayEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrackDayJpaRepository extends JpaRepository<TrackDayEntity, String> {
    List<TrackDayEntity> findByUserId(String userId);
}
