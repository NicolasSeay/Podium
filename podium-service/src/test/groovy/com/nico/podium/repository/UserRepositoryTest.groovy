package com.nico.podium.repository

import com.nico.podium.domain.PodiumModels.User
import com.nico.podium.repository.impl.*
import com.nico.podium.repository.jpa.UserJpaRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*

@SpringBootTest
class UserRepositoryTest {
    @Autowired UserJpaRepository users

    @Test
    void savesAndFindsUsersByIdAndEmail() {
        def repository = new UserRepositoryImpl(users)
        def user = repository.save(new User(null, 'driver@example.com', 'secret', 'Driver', 'Example'))
        assertEquals(user, repository.findById(1L).orElseThrow())
        assertEquals(user, repository.findByEmail('DRIVER@example.com').orElseThrow())
    }
}
