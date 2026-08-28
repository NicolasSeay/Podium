package com.nico.podium.repository;

import com.nico.podium.domain.PodiumModels.PersonalRecord;

import java.util.List;

public interface PersonalRecordRepository {
    PersonalRecord save(PersonalRecord record);

    List<PersonalRecord> findByUserId(Long userId);
}