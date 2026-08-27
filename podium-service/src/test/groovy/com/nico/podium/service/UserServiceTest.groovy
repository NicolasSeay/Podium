package com.nico.podium.service

import com.nico.podium.domain.PodiumModels.User
import com.nico.podium.repository.UserRepository
import com.nico.podium.service.impl.UserServiceImpl
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*
import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.*

class UserServiceTest {
    @Test
    void updatesUserNameWithoutChangingIdentity() {
        def users = mock(UserRepository)
        def current = new User('u1', 'driver@example.com', 'secret', 'Driver')
        when(users.findById('u1')).thenReturn(Optional.of(current))
        when(users.save(any(User))).thenAnswer { it.arguments[0] }
        def updated = new UserServiceImpl(users).update('u1', [name: 'Updated'])
        assertEquals('Updated', updated.name())
        assertEquals(current.email(), updated.email())
    }
}
