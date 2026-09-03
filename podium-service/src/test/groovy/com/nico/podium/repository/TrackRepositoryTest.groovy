package com.nico.podium.repository

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.repository.impl.TrackRepositoryImpl
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
    @Test
    void managesTracks() {
        def repository = new TrackRepositoryImpl(tracks)
        def track = repository.save(new Track(null, 'Road Atlanta', 'Braselton', 'United States', 2.54G))
        assertTrue(repository.findAll().contains(track))
        repository.deleteById(track.id())
        assertTrue(repository.findById(track.id()).isEmpty())
    }
}
