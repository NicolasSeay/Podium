package com.nico.podium.repository.jpa;

import com.nico.podium.domain.entity.PersonalRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PersonalRecordJpaRepository extends JpaRepository<PersonalRecordEntity, String> {
    List<PersonalRecordEntity> findByUserId(String userId);
}
