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
        List<DashboardSession> analyticsSessions = d.stream().flatMap(day -> sessions.findByTrackDayId(day.id()).stream()
            .map(session -> new DashboardSession(session.id(), day.id(), day.startDate(), day.vehicleId(),
                session.name(), laps.findBySessionId(session.id())))).toList();
        List<Session> s = analyticsSessions.stream().map(session -> new Session(session.sessionId(), session.trackDayId(),
            session.sessionName(), null)).toList();
        List<Lap> l = analyticsSessions.stream().flatMap(session -> session.laps().stream()).toList();
        List<PersonalRecord> filteredRecords = records.list(userId).stream().filter(record -> trackId == null || trackId.equals(record.trackId())).filter(record -> vehicleId == null || vehicleId.equals(record.vehicleId())).toList();
        return new DashboardResponse(filteredRecords, d.size(), s.size(), l.size(), l.stream().mapToLong(Lap::timeMillis).sum(),
            d.stream().sorted(Comparator.comparing(TrackDay::startDate).reversed()).limit(5).toList(), analyticsSessions);
    }
}