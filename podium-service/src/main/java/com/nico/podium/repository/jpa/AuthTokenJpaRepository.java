package com.nico.podium.repository.jpa;

import com.nico.podium.domain.entity.AuthTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthTokenJpaRepository extends JpaRepository<AuthTokenEntity, Long> {
    Optional<AuthTokenEntity> findByTokenHashAndRevokedAtIsNull(String tokenHash);
}