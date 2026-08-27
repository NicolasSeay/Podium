package com.nico.podium.repository.jpa;

import com.nico.podium.domain.entity.VehicleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VehicleJpaRepository extends JpaRepository<VehicleEntity, String> {
    List<VehicleEntity> findByUserId(String userId);
}
