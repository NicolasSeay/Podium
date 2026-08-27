package com.nico.podium.repository

import com.nico.podium.domain.PodiumModels.Lap
import com.nico.podium.repository.impl.*
import com.nico.podium.repository.jpa.LapJpaRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*

@SpringBootTest
class LapRepositoryTest {
    @Autowired LapJpaRepository laps

    @Test
    void managesLapsBySession() {
        def repository = new LapRepositoryImpl(laps)
        def lap = new Lap('l1', 's1', 1, 95000L)
        repository.save(lap)
        assertEquals(lap, repository.findById('l1').orElseThrow())
        assertEquals([lap], repository.findBySessionId('s1'))
        repository.deleteById('l1')
        assertTrue(repository.findById('l1').isEmpty())
    }
}
