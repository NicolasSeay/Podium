package com.nico.podium.service

import com.nico.podium.domain.PodiumModels.RegisterRequest
import com.nico.podium.domain.PodiumModels.User
import com.nico.podium.repository.UserRepository
import com.nico.podium.service.impl.AuthServiceImpl
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.assertEquals
import static org.junit.jupiter.api.Assertions.assertNotNull
import static org.mockito.ArgumentMatchers.any
import static org.mockito.Mockito.mock
import static org.mockito.Mockito.when

class AuthServiceTest {
    @Test
    void registersAndAuthenticatesUsers() {
        def users = mock(UserRepository)
        when(users.findByEmail('driver@example.com')).thenReturn(Optional.empty())
        when(users.save(any(User))).thenAnswer { new User(1L, it.arguments[0].email(), it.arguments[0].password(), it.arguments[0].firstName(), it.arguments[0].lastName()) }
        def service = new AuthServiceImpl(users)
        def result = service.register(new RegisterRequest('driver@example.com', 'secret', 'Driver', 'Example'))
        assertNotNull(result.token)
        assertEquals('driver@example.com', result.user.email())
        assertEquals('Driver', result.user.firstName())
        when(users.findById(result.user.id())).thenReturn(Optional.of(result.user))
        when(users.findByEmail('driver@example.com')).thenReturn(Optional.of(result.user))
        assertEquals(result.user, service.currentUser("Bearer ${result.token}", null))
    }
}
