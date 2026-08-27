package com.nico.podium.repository

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.repository.impl.*
import com.nico.podium.repository.jpa.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*

@SpringBootTest
class TrackRepositoryTest {
    @Autowired TrackJpaRepository tracks
    @Autowired TrackConfigurationJpaRepository configurations

    @Test
    void managesTracksAndConfigurations() {
        def repository = new TrackRepositoryImpl(tracks, configurations)
        def track = new Track('t1', 'u1', 'Road Atlanta', 'Georgia')
        repository.save(track)
        repository.saveConfiguration(new TrackConfiguration('c1', 't1', 'Full', 4088))
        assertEquals([track], repository.findByUserId('u1'))
        assertEquals(1, repository.findConfigurations('t1').size())
        repository.deleteById('t1')
        assertTrue(repository.findById('t1').isEmpty())
    }
}
