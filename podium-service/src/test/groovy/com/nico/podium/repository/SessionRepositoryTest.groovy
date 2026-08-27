package com.nico.podium.repository

import com.nico.podium.domain.PodiumModels.Session
import com.nico.podium.repository.impl.*
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*

class SessionRepositoryTest {
    @Test
    void managesSessionsByTrackDay() {
        def repository = new SessionRepositoryImpl(new InMemoryDataStoreImpl())
        def session = new Session('s1', 'd1', 'Open', null)
        repository.save(session)
        assertEquals(session, repository.findById('s1').orElseThrow())
        assertEquals([session], repository.findByTrackDayId('d1'))
        repository.deleteById('s1')
        assertTrue(repository.findById('s1').isEmpty())
    }
}
