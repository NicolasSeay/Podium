package com.nico.podium.service

import com.nico.podium.domain.PodiumModels.Track
import com.nico.podium.repository.TrackRepository
import com.nico.podium.service.Impl.TrackServiceImpl
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*
import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.*

class TrackServiceTest {
    @Test
    void createsAndRejectsOtherOwners() {
        def tracks = mock(TrackRepository)
        when(tracks.save(any(Track))).thenAnswer { it.arguments[0] }
        def service = new TrackServiceImpl(tracks)
        def track = service.create('u1', [name: 'Road Atlanta'])
        when(tracks.findById(track.id())).thenReturn(Optional.of(track))
        assertEquals('u1', service.get('u1', track.id()).userId())
        assertThrows(Exception) { service.get('u2', track.id()) }
    }
}
