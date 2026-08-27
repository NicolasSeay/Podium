package com.nico.podium.service

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.repository.*
import com.nico.podium.service.impl.DashboardServiceImpl
import org.junit.jupiter.api.Test
import java.time.LocalDate

import static org.junit.jupiter.api.Assertions.*
import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.*

class DashboardServiceTest {
    @Test
    void aggregatesTrackDaySessionAndLapTotals() {
        def days = mock(TrackDayRepository)
        def sessions = mock(SessionRepository)
        def laps = mock(LapRepository)
        def records = mock(PersonalRecordService)
        when(days.findByUserId('u1')).thenReturn([new TrackDay('d1', 'u1', 't1', null, LocalDate.of(2026, 8, 24), null, null)])
        when(sessions.findByTrackDayId('d1')).thenReturn([new Session('s1', 'd1', 'Open', null)])
        when(laps.findBySessionId('s1')).thenReturn([new Lap('l1', 's1', 1, 95000L)])
        when(records.list('u1')).thenReturn([])
        def result = new DashboardServiceImpl(days, sessions, laps, records).get('u1')
        assertEquals(1, result.totalTrackDays)
        assertEquals(1, result.totalSessions)
        assertEquals(1, result.totalLaps)
        assertEquals(95000L, result.totalLapTimeMillis)
    }
}
