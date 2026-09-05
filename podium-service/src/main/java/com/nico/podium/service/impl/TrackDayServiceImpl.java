package com.nico.podium.service.impl;

import com.nico.podium.domain.PodiumModels.*;
import com.nico.podium.repository.LapRepository;
import com.nico.podium.repository.SessionRepository;
import com.nico.podium.repository.TrackDayRepository;
import com.nico.podium.service.PersonalRecordService;
import com.nico.podium.service.TrackDayService;
import com.nico.podium.service.TrackService;
import com.nico.podium.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static com.nico.podium.service.impl.ServiceSupportImpl.error;
import static com.nico.podium.service.impl.ServiceSupportImpl.missing;

@Service
public class TrackDayServiceImpl implements TrackDayService {
    private final TrackDayRepository days;
    private final TrackService tracks;
    private final VehicleService vehicles;
    private final SessionRepository sessions;
    private final LapRepository laps;
    private final PersonalRecordService records;

    public TrackDayServiceImpl(TrackDayRepository days, TrackService tracks, VehicleService vehicles) {
        this(days, tracks, vehicles, null, null, null);
    }

    @Autowired
    public TrackDayServiceImpl(TrackDayRepository days, TrackService tracks, VehicleService vehicles, SessionRepository sessions, LapRepository laps, PersonalRecordService records) {
        this.days = days;
        this.tracks = tracks;
        this.vehicles = vehicles;
        this.sessions = sessions;
        this.laps = laps;
        this.records = records;
    }

    public List<TrackDay> list(Long userId, Long trackId, Long vehicleId, LocalDate from, LocalDate to) {
        return days.findByUserId(userId).stream().filter(d -> trackId == null || d.trackId().equals(trackId)).filter(d -> vehicleId == null || vehicleId.equals(d.vehicleId())).filter(d -> from == null || !d.startDate().isBefore(from)).filter(d -> to == null || !d.startDate().isAfter(to)).toList();
    }

    public List<TrackDayStats> stats(Long userId) {
        return days.findByUserId(userId).stream().map(day -> {
            List<Lap> dayLaps = sessions.findByTrackDayId(day.id()).stream().flatMap(session -> laps.findBySessionId(session.id()).stream()).toList();
            Long fastest = dayLaps.stream().mapToLong(Lap::timeMillis).min().orElse(0L);
            Long average = dayLaps.isEmpty() ? 0L : Math.round(dayLaps.stream().mapToLong(Lap::timeMillis).average().orElse(0));
            return new TrackDayStats(day.id(), fastest, average);
        }).toList();
    }

    public TrackDay get(Long userId, Long id) {
        TrackDay d = days.findById(id).orElseThrow(() -> missing("track day"));
        if (!d.userId().equals(userId)) {
            throw missing("track day");
        }
        return d;
    }

    public TrackDay create(Long userId, TrackDayRequest request) {
        Long trackId = request.trackId();
        if (trackId == null) {
            throw error(HttpStatus.BAD_REQUEST, "trackId is required");
        }
        tracks.get(trackId);
        Long vehicleId = request.vehicleId();
        if (vehicleId == null) {
            throw error(HttpStatus.BAD_REQUEST, "vehicleId is required");
        }
        vehicles.get(userId, vehicleId);
        LocalDate start = request.startDate() == null ? LocalDate.now() : request.startDate();
        return days.save(new TrackDay(null, userId, trackId, vehicleId, start, request.endDate() == null ? start : request.endDate(), request.notes(), request.conditions()));
    }

    @Transactional
    public CompletedTrackDay complete(Long userId, TrackDayRequest request) {
        if (sessions == null || laps == null || records == null) {
            throw error(HttpStatus.INTERNAL_SERVER_ERROR, "completion is unavailable");
        }
        Long trackId = request.trackId();
        if (trackId == null) {
            throw error(HttpStatus.BAD_REQUEST, "trackId is required");
        }
        tracks.get(trackId);
        Long vehicleId = request.vehicleId();
        if (vehicleId == null) {
            throw error(HttpStatus.BAD_REQUEST, "vehicleId is required");
        }
        vehicles.get(userId, vehicleId);
        LocalDate start = request.startDate() == null ? LocalDate.now() : request.startDate();
        LocalDate end = request.endDate() == null ? start : request.endDate();
        if (end.isBefore(start)) {
            throw error(HttpStatus.BAD_REQUEST, "endDate must be on or after startDate");
        }
        TrackDay day = days.save(new TrackDay(null, userId, trackId, vehicleId, start, end, request.notes(), request.conditions()));
        List<Session> savedSessions = new ArrayList<>();
        Map<Long, List<Lap>> savedLaps = new LinkedHashMap<>();
        for (SessionRequest sessionRequest : request.sessions() == null ? List.<SessionRequest>of() : request.sessions()) {
            LocalDate sessionDate = sessionRequest.sessionDate() == null ? start : sessionRequest.sessionDate();
            if (sessionDate.isBefore(start) || sessionDate.isAfter(end)) {
                throw error(HttpStatus.BAD_REQUEST, "sessionDate must be within the track day range");
            }
            Session session = sessions.save(new Session(null, day.id(), sessionRequest.name() == null ? "Session" : sessionRequest.name(), sessionRequest.notes(), sessionDate));
            savedSessions.add(session);
            List<Lap> sessionLaps = new ArrayList<>();
            for (LapRequest lapRequest : sessionRequest.laps() == null ? List.<LapRequest>of() : sessionRequest.laps()) {
                Long time = lapRequest.timeMillis();
                if (time == null || time <= 0) {
                    throw error(HttpStatus.BAD_REQUEST, "timeMillis must be positive");
                }
                Lap lap = laps.save(new Lap(null, session.id(), lapRequest.lapNumber() == null ? sessionLaps.size() + 1 : lapRequest.lapNumber(), time));
                records.refresh(userId, lap.id(), session.id(), time);
                sessionLaps.add(lap);
            }
            savedLaps.put(session.id(), sessionLaps);
        }
        return new CompletedTrackDay(day, savedSessions, savedLaps);
    }

    public TrackDay update(Long userId, Long id, TrackDayRequest request) {
        TrackDay c = get(userId, id);
        Long trackId = request.trackId() == null ? c.trackId() : request.trackId();
        tracks.get(trackId);
        Long vehicleId = request.vehicleId();
        if (vehicleId == null) {
            vehicleId = c.vehicleId();
        }
        vehicles.get(userId, vehicleId);
        return days.save(new TrackDay(c.id(), c.userId(), trackId, vehicleId, request.startDate() == null ? c.startDate() : request.startDate(), request.endDate() == null ? c.endDate() : request.endDate(), request.notes() == null ? c.notes() : request.notes(), request.conditions() == null ? c.conditions() : request.conditions()));
    }

    public void delete(Long userId, Long id) {
        get(userId, id);
        days.deleteById(id);
    }
}