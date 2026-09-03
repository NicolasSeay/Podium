package com.nico.podium.service.impl;

import com.nico.podium.domain.PodiumModels.PersonalRecord;
import com.nico.podium.domain.PodiumModels.Session;
import com.nico.podium.domain.PodiumModels.TrackDay;
import com.nico.podium.repository.PersonalRecordRepository;
import com.nico.podium.repository.SessionRepository;
import com.nico.podium.repository.TrackDayRepository;
import com.nico.podium.service.PersonalRecordService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class PersonalRecordServiceImpl implements PersonalRecordService {
    private final PersonalRecordRepository records;
    private final SessionRepository sessions;
    private final TrackDayRepository days;

    public PersonalRecordServiceImpl(PersonalRecordRepository records, SessionRepository sessions, TrackDayRepository days) {
        this.records = records;
        this.sessions = sessions;
        this.days = days;
    }

    public List<PersonalRecord> list(Long userId) {
        return records.findByUserId(userId);
    }

    public void refresh(Long userId, Long lapId, Long sessionId, long time) {
        Session session = sessions.findById(sessionId).orElseThrow();
        TrackDay day = days.findById(session.trackDayId()).orElseThrow();
        PersonalRecord current = records.findByUserId(userId).stream().filter(r -> r.trackId().equals(day.trackId())).min(Comparator.comparing(PersonalRecord::timeMillis)).orElse(null);
        if (current == null || time < current.timeMillis()) {
            records.save(new PersonalRecord(null, userId, lapId, day.trackId(), day.vehicleId(), time));
        }
    }
}