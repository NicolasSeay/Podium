package com.nico.podium.repository

import com.nico.podium.domain.PodiumModels.Session
import com.nico.podium.repository.impl.*
import com.nico.podium.repository.jpa.SessionJpaRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*

@SpringBootTest
class SessionRepositoryTest {
    @Autowired SessionJpaRepository sessions

    @Test
    void managesSessionsByTrackDay() {
        def repository = new SessionRepositoryImpl(sessions)
        def session = new Session('s1', 'd1', 'Open', null)
        repository.save(session)
        assertEquals(session, repository.findById('s1').orElseThrow())
        assertEquals([session], repository.findByTrackDayId('d1'))
        repository.deleteById('s1')
        assertTrue(repository.findById('s1').isEmpty())
    }
}
