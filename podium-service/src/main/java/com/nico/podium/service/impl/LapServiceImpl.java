package com.nico.podium.service.impl;

import com.nico.podium.domain.PodiumModels.Lap;
import com.nico.podium.domain.PodiumModels.LapRequest;
import com.nico.podium.repository.LapRepository;
import com.nico.podium.service.LapService;
import com.nico.podium.service.PersonalRecordService;
import com.nico.podium.service.SessionService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.nico.podium.service.impl.ServiceSupportImpl.error;
import static com.nico.podium.service.impl.ServiceSupportImpl.missing;

@Service
public class LapServiceImpl implements LapService {
    private final LapRepository laps;
    private final SessionService sessions;
    private final PersonalRecordService records;

    public LapServiceImpl(LapRepository laps, SessionService sessions, PersonalRecordService records) {
        this.laps = laps;
        this.sessions = sessions;
        this.records = records;
    }

    public List<Lap> list(Long userId, Long sessionId) {
        sessions.get(userId, sessionId);
        return laps.findBySessionId(sessionId);
    }

    public Lap get(Long userId, Long id) {
        Lap l = laps.findById(id).orElseThrow(() -> missing("lap"));
        sessions.get(userId, l.sessionId());
        return l;
    }

    public Lap create(Long userId, Long sessionId, LapRequest request) {
        sessions.get(userId, sessionId);
        Long time = request.timeMillis();
        if (time == null || time <= 0) {
            throw error(HttpStatus.BAD_REQUEST, "timeMillis must be positive");
        }
        Lap l = laps.save(new Lap(null, sessionId, request.lapNumber() == null ? laps.findBySessionId(sessionId).size() + 1 : request.lapNumber(), time));
        records.refresh(userId, l.id(), sessionId, time);
        return l;
    }

    public Lap update(Long userId, Long id, LapRequest request) {
        Lap c = get(userId, id);
        Long time = request.timeMillis();
        Lap l = laps.save(new Lap(c.id(), c.sessionId(), request.lapNumber() == null ? c.lapNumber() : request.lapNumber(), time == null ? c.timeMillis() : time));
        records.refresh(userId, l.id(), l.sessionId(), l.timeMillis());
        return l;
    }

    public void delete(Long userId, Long id) {
        get(userId, id);
        laps.deleteById(id);
    }
}