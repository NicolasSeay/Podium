package com.nico.podium.repository.jpa;

import com.nico.podium.domain.entity.SessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SessionJpaRepository extends JpaRepository<SessionEntity, String> {
    List<SessionEntity> findByTrackDayId(String trackDayId);
}
