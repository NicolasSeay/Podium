package com.nico.podium.repository

import com.nico.podium.domain.PodiumModels.TrackDay
import com.nico.podium.repository.impl.TrackDayRepositoryImpl
import com.nico.podium.repository.jpa.TrackDayJpaRepository
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

import java.time.LocalDate

import static org.junit.jupiter.api.Assertions.assertEquals
import static org.junit.jupiter.api.Assertions.assertTrue

@SpringBootTest
class TrackDayRepositoryTest {
    @Autowired
    TrackDayJpaRepository trackDays

    @Test
    void managesTrackDaysByOwner() {
        def repository = new TrackDayRepositoryImpl(trackDays)
        def day = repository.save(new TrackDay(null, 1L, 1L, 1L, LocalDate.of(2026, 8, 24), 'notes', 'dry'))
        assertEquals(day, repository.findById(1L).orElseThrow())
        assertEquals([day], repository.findByUserId(1L))
        repository.deleteById(day.id())
        assertTrue(repository.findById(day.id()).isEmpty())
    }
}
