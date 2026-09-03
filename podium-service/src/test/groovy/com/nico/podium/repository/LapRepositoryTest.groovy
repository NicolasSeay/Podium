package com.nico.podium.repository

import com.nico.podium.domain.PodiumModels.Lap
import com.nico.podium.repository.impl.LapRepositoryImpl
import com.nico.podium.repository.jpa.LapJpaRepository
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

import static org.junit.jupiter.api.Assertions.assertEquals
import static org.junit.jupiter.api.Assertions.assertTrue

@SpringBootTest
class LapRepositoryTest {
    @Autowired
    LapJpaRepository laps

    @Test
    void managesLapsBySession() {
        def repository = new LapRepositoryImpl(laps)
        def lap = repository.save(new Lap(null, 1L, 1, 95000L))
        assertEquals(lap, repository.findById(1L).orElseThrow())
        assertEquals([lap], repository.findBySessionId(1L))
        repository.deleteById(lap.id())
        assertTrue(repository.findById(lap.id()).isEmpty())
    }
}
