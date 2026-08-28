package com.nico.podium.repository.jpa;

import com.nico.podium.domain.entity.LapEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LapJpaRepository extends JpaRepository<LapEntity, Long> {
    List<LapEntity> findBySessionId(Long sessionId);
}
