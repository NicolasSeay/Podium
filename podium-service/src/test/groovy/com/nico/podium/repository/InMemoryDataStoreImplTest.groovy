package com.nico.podium.repository

import com.nico.podium.domain.PodiumModels.User
import com.nico.podium.repository.impl.InMemoryDataStoreImpl
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*

class InMemoryDataStoreImplTest {
    @Test
    void providesIndependentInMemoryCollections() {
        def store = new InMemoryDataStoreImpl()
        store.users.put('u1', new User('u1', 'driver@example.com', 'secret', 'Driver'))
        assertEquals(1, store.users.size())
        assertTrue(store.tracks.isEmpty())
    }
}
