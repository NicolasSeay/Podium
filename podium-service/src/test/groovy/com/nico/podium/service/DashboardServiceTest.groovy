package com.nico.podium.service

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.repository.LapRepository
import com.nico.podium.repository.SessionRepository
import com.nico.podium.repository.TrackDayRepository
import com.nico.podium.service.impl.DashboardServiceImpl
import org.junit.jupiter.api.Test

import java.time.LocalDate

import static org.junit.jupiter.api.Assertions.assertEquals
import static org.junit.jupiter.api.Assertions.assertTrue
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
        def result = new DashboardServiceImpl(days, sessions, laps, records).get(1L, null, null)
        assertEquals(1, result.totalTrackDays)
        assertEquals(1, result.totalSessions)
        assertEquals(1, result.totalLaps)
        assertEquals(95000L, result.totalLapTimeMillis)
        assertEquals([1L], result.analyticsSessions*.sessionId())
    }

    @Test
    void returnsEmptyDashboardForUserWithoutTrackDays() {
        def days = mock(TrackDayRepository)
        def sessions = mock(SessionRepository)
        def laps = mock(LapRepository)
        def records = mock(PersonalRecordService)
        when(days.findByUserId(1L)).thenReturn([])
        when(records.list(1L)).thenReturn([])

        def result = new DashboardServiceImpl(days, sessions, laps, records).get(1L, null, null)

        assertEquals(0, result.totalTrackDays)
        assertEquals(0, result.totalSessions)
        assertEquals(0, result.totalLaps)
        assertEquals(0L, result.totalLapTimeMillis)
        assertTrue(result.recentTrackDays.isEmpty())
        assertTrue(result.analyticsSessions.isEmpty())
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

        def result = new DashboardServiceImpl(days, sessions, laps, records).get(1L, null, null)

        assertEquals([6L, 5L, 4L, 3L, 2L], result.recentTrackDays*.id())
        verify(sessions).findByTrackDayId(1L)
        verify(sessions).findByTrackDayId(6L)
    }

    @Test
    void filtersDashboardDataByTrackAndVehicle() {
        def days = mock(TrackDayRepository)
        def sessions = mock(SessionRepository)
        def laps = mock(LapRepository)
        def records = mock(PersonalRecordService)
        when(days.findByUserId(1L)).thenReturn([
                new TrackDay(1L, 1L, 10L, 20L, LocalDate.of(2026, 8, 24), null, null),
                new TrackDay(2L, 1L, 11L, 21L, LocalDate.of(2026, 8, 25), null, null),
        ])
        when(sessions.findByTrackDayId(1L)).thenReturn([new Session(1L, 1L, 'Open', null)])
        when(laps.findBySessionId(1L)).thenReturn([new Lap(1L, 1L, 1, 95000L)])
        when(records.list(1L)).thenReturn([
                new PersonalRecord(1L, 1L, 1L, 10L, 20L, 95000L),
                new PersonalRecord(2L, 1L, 2L, 11L, 21L, 96000L),
        ])

        def result = new DashboardServiceImpl(days, sessions, laps, records).get(1L, 10L, 20L)

        assertEquals(1, result.totalTrackDays)
        assertEquals(1, result.totalSessions)
        assertEquals(1, result.totalLaps)
        assertEquals([1L], result.personalRecords*.id())
        assertEquals([1L], result.recentTrackDays*.id())
        verify(sessions, never()).findByTrackDayId(2L)
    }
}
