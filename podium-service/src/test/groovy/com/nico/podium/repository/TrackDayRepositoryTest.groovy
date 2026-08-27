package com.nico.podium.repository

import com.nico.podium.domain.PodiumModels.TrackDay
import com.nico.podium.repository.impl.*
import org.junit.jupiter.api.Test
import java.time.LocalDate

import static org.junit.jupiter.api.Assertions.*

class TrackDayRepositoryTest {
    @Test
    void managesTrackDaysByOwner() {
        def repository = new TrackDayRepositoryImpl(new InMemoryDataStoreImpl())
        def day = new TrackDay('d1', 'u1', 't1', 'v1', LocalDate.of(2026, 8, 24), 'notes', 'dry')
        repository.save(day)
        assertEquals(day, repository.findById('d1').orElseThrow())
        assertEquals([day], repository.findByUserId('u1'))
        repository.deleteById('d1')
        assertTrue(repository.findById('d1').isEmpty())
    }
}
