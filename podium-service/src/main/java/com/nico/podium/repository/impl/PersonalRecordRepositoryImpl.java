package com.nico.podium.repository.impl;

import com.nico.podium.domain.PodiumModels.PersonalRecord;
import com.nico.podium.domain.entity.PersonalRecordEntity;
import com.nico.podium.repository.PersonalRecordRepository;
import com.nico.podium.repository.jpa.PersonalRecordJpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class PersonalRecordRepositoryImpl implements PersonalRecordRepository {
    private final PersonalRecordJpaRepository repository;

    public PersonalRecordRepositoryImpl(PersonalRecordJpaRepository repository) {
        this.repository = repository;
    }

    public PersonalRecord save(PersonalRecord value) {
        return repository.save(new PersonalRecordEntity(value)).toDomain();
    }

    public List<PersonalRecord> findByUserId(String userId) {
        return repository.findByUserId(userId).stream()
                .map(PersonalRecordEntity::toDomain)
                .toList();
    }
}