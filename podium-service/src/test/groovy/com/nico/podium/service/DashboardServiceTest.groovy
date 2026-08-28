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

    @Test
    void returnsEmptyDashboardForUserWithoutTrackDays() {
        def days = mock(TrackDayRepository)
        def sessions = mock(SessionRepository)
        def laps = mock(LapRepository)
        def records = mock(PersonalRecordService)
        when(days.findByUserId('u1')).thenReturn([])
        when(records.list('u1')).thenReturn([])

        def result = new DashboardServiceImpl(days, sessions, laps, records).get('u1')

        assertEquals(0, result.totalTrackDays)
        assertEquals(0, result.totalSessions)
        assertEquals(0, result.totalLaps)
        assertEquals(0L, result.totalLapTimeMillis)
        assertTrue(result.recentTrackDays.isEmpty())
        verifyNoInteractions(sessions, laps)
    }

    @Test
    void returnsFiveMostRecentTrackDays() {
        def days = mock(TrackDayRepository)
        def sessions = mock(SessionRepository)
        def laps = mock(LapRepository)
        def records = mock(PersonalRecordService)
        def trackDays = (1..6).collect { day ->
            new TrackDay("d${day}", 'u1', "t${day}", null, LocalDate.of(2026, 8, day), null, null)
        }
        when(days.findByUserId('u1')).thenReturn(trackDays)
        when(records.list('u1')).thenReturn([])

        def result = new DashboardServiceImpl(days, sessions, laps, records).get('u1')

        assertEquals(['d6', 'd5', 'd4', 'd3', 'd2'], result.recentTrackDays*.id())
        verify(sessions).findByTrackDayId('d1')
        verify(sessions).findByTrackDayId('d6')
    }
}
