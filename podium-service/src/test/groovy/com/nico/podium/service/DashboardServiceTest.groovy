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
        when(days.findByUserId(1L)).thenReturn([new TrackDay(1L, 1L, 1L, null, LocalDate.of(2026, 8, 24), null, null)])
        when(sessions.findByTrackDayId(1L)).thenReturn([new Session(1L, 1L, 'Open', null)])
        when(laps.findBySessionId(1L)).thenReturn([new Lap(1L, 1L, 1, 95000L)])
        when(records.list(1L)).thenReturn([])
        def result = new DashboardServiceImpl(days, sessions, laps, records).get(1L)
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
        when(days.findByUserId(1L)).thenReturn([])
        when(records.list(1L)).thenReturn([])

        def result = new DashboardServiceImpl(days, sessions, laps, records).get(1L)

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
            new TrackDay(day as Long, 1L, day as Long, null, LocalDate.of(2026, 8, day), null, null)
        }
        when(days.findByUserId(1L)).thenReturn(trackDays)
        when(records.list(1L)).thenReturn([])

        def result = new DashboardServiceImpl(days, sessions, laps, records).get(1L)

        assertEquals([6L, 5L, 4L, 3L, 2L], result.recentTrackDays*.id())
        verify(sessions).findByTrackDayId(1L)
        verify(sessions).findByTrackDayId(6L)
    }
}
