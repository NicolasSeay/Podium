package com.nico.podium.service.impl;

import com.nico.podium.domain.PodiumModels.*;
import com.nico.podium.repository.LapRepository;
import com.nico.podium.repository.SessionRepository;
import com.nico.podium.repository.TrackDayRepository;
import com.nico.podium.service.DashboardService;
import com.nico.podium.service.PersonalRecordService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {
    private final TrackDayRepository days;
    private final SessionRepository sessions;
    private final LapRepository laps;
    private final PersonalRecordService records;

    public DashboardServiceImpl(TrackDayRepository days, SessionRepository sessions, LapRepository laps, PersonalRecordService records) {
        this.days = days;
        this.sessions = sessions;
        this.laps = laps;
        this.records = records;
    }

    public DashboardResponse get(Long userId, Long trackId, Long vehicleId) {
        List<TrackDay> d = days.findByUserId(userId).stream().filter(day -> trackId == null || trackId.equals(day.trackId())).filter(day -> vehicleId == null || vehicleId.equals(day.vehicleId())).toList();
        List<Session> s = d.stream().flatMap(day -> sessions.findByTrackDayId(day.id()).stream()).toList();
        List<Lap> l = s.stream().flatMap(session -> laps.findBySessionId(session.id()).stream()).toList();
        List<PersonalRecord> filteredRecords = records.list(userId).stream().filter(record -> trackId == null || trackId.equals(record.trackId())).filter(record -> vehicleId == null || vehicleId.equals(record.vehicleId())).toList();
        return new DashboardResponse(filteredRecords, d.size(), s.size(), l.size(), l.stream().mapToLong(Lap::timeMillis).sum(), d.stream().sorted(Comparator.comparing(TrackDay::startDate).reversed()).limit(5).toList());
    }
}