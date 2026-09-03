package com.nico.podium.service;

import com.nico.podium.domain.PodiumModels.PersonalRecord;

import java.util.List;

public interface PersonalRecordService {
    List<PersonalRecord> list(Long userId);

    void refresh(Long userId, Long lapId, Long sessionId, long timeMillis);
}