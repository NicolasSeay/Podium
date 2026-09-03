package com.nico.podium.service.impl;

import com.nico.podium.domain.PodiumModels.Session;
import com.nico.podium.domain.PodiumModels.SessionRequest;
import com.nico.podium.repository.SessionRepository;
import com.nico.podium.service.SessionService;
import com.nico.podium.service.TrackDayService;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.nico.podium.service.impl.ServiceSupportImpl.missing;

@Service
public class SessionServiceImpl implements SessionService {
    private final SessionRepository sessions;
    private final TrackDayService days;

    public SessionServiceImpl(SessionRepository sessions, TrackDayService days) {
        this.sessions = sessions;
        this.days = days;
    }

    public List<Session> list(Long userId, Long trackDayId) {
        days.get(userId, trackDayId);
        return sessions.findByTrackDayId(trackDayId);
    }

    public Session get(Long userId, Long id) {
        Session s = sessions.findById(id).orElseThrow(() -> missing("session"));
        days.get(userId, s.trackDayId());
        return s;
    }

    public Session create(Long userId, Long trackDayId, SessionRequest request) {
        days.get(userId, trackDayId);
        return sessions.save(new Session(null, trackDayId, request.name() == null ? "Session" : request.name(), request.notes()));
    }

    public Session update(Long userId, Long id, SessionRequest request) {
        Session c = get(userId, id);
        return sessions.save(new Session(c.id(), c.trackDayId(), request.name() == null ? c.name() : request.name(), request.notes() == null ? c.notes() : request.notes()));
    }

    public void delete(Long userId, Long id) {
        get(userId, id);
        sessions.deleteById(id);
    }
}