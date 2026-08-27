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
        def track = new Track('t1', 'u1', 'Road Atlanta', null)
        def vehicle = new Vehicle('v1', 'u1', 'MX-5', null, null, null)
        when(tracks.get('u1', 't1')).thenReturn(track)
        when(vehicles.get('u1', 'v1')).thenReturn(vehicle)
        when(days.save(any(TrackDay))).thenAnswer { it.arguments[0] }
        def day = new TrackDayServiceImpl(days, tracks, vehicles).create('u1', [trackId: 't1', vehicleId: 'v1'])
        assertEquals('t1', day.trackId())
        verify(tracks).get('u1', 't1')
        verify(vehicles).get('u1', 'v1')
    }
}
