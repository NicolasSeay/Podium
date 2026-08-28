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
        def session = repository.save(new Session(null, 1L, 'Open', null))
        assertEquals(session, repository.findById(1L).orElseThrow())
        assertEquals([session], repository.findByTrackDayId(1L))
        repository.deleteById(session.id())
        assertTrue(repository.findById(session.id()).isEmpty())
    }
}
