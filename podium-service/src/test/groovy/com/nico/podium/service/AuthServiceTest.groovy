package com.nico.podium.service

import com.nico.podium.domain.PodiumModels.User
import com.nico.podium.repository.UserRepository
import com.nico.podium.service.Impl.AuthServiceImpl
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*
import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.*

class AuthServiceTest {
    @Test
    void registersAndAuthenticatesUsers() {
        def users = mock(UserRepository)
        when(users.findByEmail('driver@example.com')).thenReturn(Optional.empty())
        when(users.save(any(User))).thenAnswer { it.arguments[0] }
        def service = new AuthServiceImpl(users)
        def result = service.register('driver@example.com', 'secret', 'Driver')
        assertNotNull(result.token)
        assertEquals('driver@example.com', result.user.email())
        when(users.findById(result.user.id())).thenReturn(Optional.of(result.user))
        when(users.findByEmail('driver@example.com')).thenReturn(Optional.of(result.user))
        assertEquals(result.user, service.currentUser("Bearer ${result.token}", null))
    }
}
