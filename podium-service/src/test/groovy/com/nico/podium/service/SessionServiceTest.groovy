package com.nico.podium.service

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.repository.SessionRepository
import com.nico.podium.service.impl.SessionServiceImpl
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.assertEquals
import static org.mockito.ArgumentMatchers.any
import static org.mockito.Mockito.mock
import static org.mockito.Mockito.when

class SessionServiceTest {
    @Test
    void createsSessionForTrackDay() {
        def sessions = mock(SessionRepository)
        def days = mock(TrackDayService)
        when(days.get(1L, 1L)).thenReturn(new TrackDay(1L, 1L, 1L, null, null, null, null))
        when(sessions.save(any(Session))).thenAnswer { it.arguments[0] }
        def session = new SessionServiceImpl(sessions, days).create(1L, 1L, new SessionRequest('Open', null, null))
        assertEquals(1L, session.trackDayId())
        assertEquals('Open', session.name())
    }
}
