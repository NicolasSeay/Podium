package com.nico.podium.service

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.repository.TrackDayRepository
import com.nico.podium.repository.LapRepository
import com.nico.podium.repository.SessionRepository
import com.nico.podium.service.PersonalRecordService
import com.nico.podium.service.impl.TrackDayServiceImpl
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.assertEquals
import static org.mockito.ArgumentMatchers.any
import static org.mockito.Mockito.*

class TrackDayServiceTest {
    @Test
    void createsTrackDayAfterValidatingReferences() {
        def days = mock(TrackDayRepository)
        def tracks = mock(TrackService)
        def vehicles = mock(VehicleService)
        def sessions = mock(SessionRepository)
        def laps = mock(LapRepository)
        def records = mock(PersonalRecordService)
        def track = new Track(1L, 'Road Atlanta', 'Braselton', 'United States', 2.54G)
        def vehicle = new Vehicle(1L, 1L, 'MX-5', null, null, null, null)
        when(tracks.get(1L)).thenReturn(track)
        when(vehicles.get(1L, 1L)).thenReturn(vehicle)
        when(days.save(any(TrackDay))).thenAnswer { invocation ->
            def value = invocation.arguments[0] as TrackDay
            new TrackDay(1L, value.userId(), value.trackId(), value.vehicleId(), value.startDate(), value.endDate(), value.notes(), value.conditions())
        }
        when(sessions.findByTrackDayId(1L)).thenReturn([])
        def day = new TrackDayServiceImpl(days, tracks, vehicles, sessions, laps, records).create(1L, new TrackDayRequest(1L, 1L, null, null, null, null, []))
        assertEquals(1L, day.trackDay().trackId())
        verify(tracks).get(1L)
        verify(vehicles).get(1L, 1L)
    }
}
