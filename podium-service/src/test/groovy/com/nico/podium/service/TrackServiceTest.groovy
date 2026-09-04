package com.nico.podium.service

import com.nico.podium.domain.PodiumModels.Track
import com.nico.podium.repository.TrackRepository
import com.nico.podium.service.impl.TrackServiceImpl
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.assertEquals
import static org.mockito.Mockito.mock
import static org.mockito.Mockito.when

class TrackServiceTest {
    @Test
    void readsCatalogTracksForAnyAuthenticatedUser() {
        def tracks = mock(TrackRepository)
        def service = new TrackServiceImpl(tracks)
        def track = new Track(1L, 'Road Atlanta', 'Braselton', 'United States', new BigDecimal('2.54'))
        when(tracks.findById(track.id())).thenReturn(Optional.of(track))
        assertEquals('Braselton', service.get(track.id()).city())
    }
}
