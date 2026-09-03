package com.nico.podium.service

import com.nico.podium.domain.PodiumModels.User
import com.nico.podium.domain.PodiumModels.UserUpdateRequest
import com.nico.podium.repository.UserRepository
import com.nico.podium.service.impl.UserServiceImpl
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.assertEquals
import static org.mockito.ArgumentMatchers.any
import static org.mockito.Mockito.mock
import static org.mockito.Mockito.when

class UserServiceTest {
    @Test
    void updatesUserNameWithoutChangingIdentity() {
        def users = mock(UserRepository)
        def current = new User(1L, 'driver@example.com', 'secret', 'Driver', 'Example')
        when(users.findById(1L)).thenReturn(Optional.of(current))
        when(users.save(any(User))).thenAnswer { it.arguments[0] }
        def updated = new UserServiceImpl(users).update(1L, new UserUpdateRequest('Updated', 'Person'))
        assertEquals('Updated', updated.firstName())
        assertEquals('Person', updated.lastName())
        assertEquals(current.email(), updated.email())
    }
}
