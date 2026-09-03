package com.nico.podium.service

import com.nico.podium.domain.PodiumModels.TrackDayRequest
import com.nico.podium.domain.PodiumModels.TrackRequest
import org.junit.jupiter.api.Test

import java.time.LocalDate

import static org.junit.jupiter.api.Assertions.assertEquals

class ServiceSupportImplTest {
    @Test
    void storesTypedRequestValues() {
        def track = new TrackRequest('Road Atlanta', 'Braselton', 'United States', new BigDecimal('2.54'))
        def trackDay = new TrackDayRequest(1L, 2L, LocalDate.of(2026, 8, 24), null, 'notes', 'dry', null)

        assertEquals('Road Atlanta', track.name())
        assertEquals(2.54G, track.lengthMiles())
        assertEquals(LocalDate.of(2026, 8, 24), trackDay.startDate())
    }
}
