package com.nico.podium.service

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.repository.TrackDayRepository
import com.nico.podium.service.impl.TrackDayServiceImpl
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*
import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.*

class TrackDayServiceTest {
    @Test
    void createsTrackDayAfterValidatingReferences() {
        def days = mock(TrackDayRepository)
        def tracks = mock(TrackService)
        def vehicles = mock(VehicleService)
        def track = new Track(1L, 'Road Atlanta', 'Braselton', 'United States', 2.54G)
        def vehicle = new Vehicle(1L, 1L, 'MX-5', null, null, null, null)
        when(tracks.get(1L, 1L)).thenReturn(track)
        when(vehicles.get(1L, 1L)).thenReturn(vehicle)
        when(days.save(any(TrackDay))).thenAnswer { it.arguments[0] }
        def day = new TrackDayServiceImpl(days, tracks, vehicles).create(1L, [trackId: 1L, vehicleId: 1L])
        assertEquals(1L, day.trackId())
        verify(tracks).get(1L, 1L)
        verify(vehicles).get(1L, 1L)
    }
}
