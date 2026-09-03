package com.nico.podium.repository

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.repository.impl.TrackRepositoryImpl
import com.nico.podium.repository.jpa.TrackConfigurationJpaRepository
import com.nico.podium.repository.jpa.TrackJpaRepository
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

import static org.junit.jupiter.api.Assertions.assertEquals
import static org.junit.jupiter.api.Assertions.assertTrue

@SpringBootTest
class TrackRepositoryTest {
    @Autowired
    TrackJpaRepository tracks
    @Autowired
    TrackConfigurationJpaRepository configurations

    @Test
    void managesTracksAndConfigurations() {
        def repository = new TrackRepositoryImpl(tracks, configurations)
        def track = repository.save(new Track(null, 'Road Atlanta', 'Braselton', 'United States', 2.54G))
        repository.saveConfiguration(new TrackConfiguration(null, track.id(), 'Full', 4088))
        assertTrue(repository.findAll().contains(track))
        assertEquals(1, repository.findConfigurations(track.id()).size())
        repository.deleteById(track.id())
        assertTrue(repository.findById(track.id()).isEmpty())
    }
}
