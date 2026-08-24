package com.nico.podium.repository

import com.nico.podium.domain.PodiumModels.User
import com.nico.podium.repository.Impl.*
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*

class UserRepositoryTest {
    @Test
    void savesAndFindsUsersByIdAndEmail() {
        def repository = new UserRepositoryImpl(new InMemoryDataStoreImpl())
        def user = new User('u1', 'driver@example.com', 'secret', 'Driver')
        repository.save(user)
        assertEquals(user, repository.findById('u1').orElseThrow())
        assertEquals(user, repository.findByEmail('DRIVER@example.com').orElseThrow())
    }
}
