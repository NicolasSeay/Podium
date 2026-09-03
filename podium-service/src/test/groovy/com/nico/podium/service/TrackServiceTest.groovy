package com.nico.podium.service

import com.nico.podium.domain.PodiumModels.Track
import com.nico.podium.domain.PodiumModels.TrackRequest
import com.nico.podium.repository.TrackRepository
import com.nico.podium.service.impl.TrackServiceImpl
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.assertEquals
import static org.mockito.ArgumentMatchers.any
import static org.mockito.Mockito.*

class TrackServiceTest {
    @Test
    void createsAndReturnsCatalogTracks() {
        def tracks = mock(TrackRepository)
        when(tracks.save(any(Track))).thenAnswer { it.arguments[0] }
        def service = new TrackServiceImpl(tracks)
        def track = service.create(1L, new TrackRequest('Road Atlanta', 'Braselton', 'United States', new BigDecimal('2.54')))
        when(tracks.findById(track.id())).thenReturn(Optional.of(track))
        assertEquals('Braselton', service.get(2L, track.id()).city())
        verify(tracks).save(track)
    }
}
