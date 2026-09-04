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
    void readsTracksWithoutMutationOperations() {
        def repository = new TrackRepositoryImpl(tracks)
        assertTrue(repository.findAll().isEmpty())
        assertTrue(repository.findById(1L).isEmpty())
    }
}
