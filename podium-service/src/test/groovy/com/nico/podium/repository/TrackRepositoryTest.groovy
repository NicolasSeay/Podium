package com.nico.podium.repository

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.repository.Impl.*
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*

class TrackRepositoryTest {
    @Test
    void managesTracksAndConfigurations() {
        def repository = new TrackRepositoryImpl(new InMemoryDataStoreImpl())
        def track = new Track('t1', 'u1', 'Road Atlanta', 'Georgia')
        repository.save(track)
        repository.saveConfiguration(new TrackConfiguration('c1', 't1', 'Full', 4088))
        assertEquals([track], repository.findByUserId('u1'))
        assertEquals(1, repository.findConfigurations('t1').size())
        repository.deleteById('t1')
        assertTrue(repository.findById('t1').isEmpty())
    }
}
