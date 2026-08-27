package com.nico.podium.service

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.repository.SessionRepository
import com.nico.podium.service.impl.SessionServiceImpl
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*
import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.*

class SessionServiceTest {
    @Test
    void createsSessionForTrackDay() {
        def sessions = mock(SessionRepository)
        def days = mock(TrackDayService)
        when(days.get('u1', 'd1')).thenReturn(new TrackDay('d1', 'u1', 't1', null, null, null, null))
        when(sessions.save(any(Session))).thenAnswer { it.arguments[0] }
        def session = new SessionServiceImpl(sessions, days).create('u1', 'd1', [name: 'Open'])
        assertEquals('d1', session.trackDayId())
        assertEquals('Open', session.name())
    }
}
