package com.nico.podium.service

import com.nico.podium.domain.PodiumModels.RegisterRequest
import com.nico.podium.domain.PodiumModels.User
import com.nico.podium.repository.jpa.AuthTokenJpaRepository
import com.nico.podium.repository.UserRepository
import com.nico.podium.service.impl.AuthServiceImpl
import org.junit.jupiter.api.Test
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

import static org.junit.jupiter.api.Assertions.assertEquals
import static org.junit.jupiter.api.Assertions.assertNotNull
import static org.junit.jupiter.api.Assertions.assertThrows
import static org.mockito.ArgumentMatchers.any
import static org.mockito.Mockito.mock
import static org.mockito.Mockito.when

class AuthServiceTest {
    @Test
    void registersAndAuthenticatesUsers() {
        def users = mock(UserRepository)
        def tokens = mock(AuthTokenJpaRepository)
        def passwordEncoder = new BCryptPasswordEncoder()
        when(users.findByEmail('driver@example.com')).thenReturn(Optional.empty())
        when(users.save(any(User))).thenAnswer { new User(1L, it.arguments[0].email(), it.arguments[0].password(), it.arguments[0].firstName(), it.arguments[0].lastName()) }
        def service = new AuthServiceImpl(users, tokens, passwordEncoder)
        def result = service.register(new RegisterRequest('driver@example.com', 'long-enough-secret', 'Driver', 'Example'))
        assertNotNull(result.token)
        assertEquals('driver@example.com', result.user.email())
        assertEquals('Driver', result.user.firstName())
        assert passwordEncoder.matches('long-enough-secret', result.user.password())
        def savedToken = new com.nico.podium.domain.entity.AuthTokenEntity('hash', result.user.id(), java.time.Instant.now().plusSeconds(3600))
        when(tokens.save(any())).thenReturn(savedToken)
        when(tokens.findByTokenHashAndRevokedAtIsNull(any())).thenReturn(Optional.of(savedToken))
        when(users.findById(result.user.id())).thenReturn(Optional.of(result.user))
        when(users.findByEmail('driver@example.com')).thenReturn(Optional.of(result.user))
        assertEquals(result.user, service.currentUser("Bearer ${result.token}", null))
    }

    @Test
    void rejectsIdentityHeadersAndMalformedTokens() {
        def users = mock(UserRepository)
        def tokens = mock(AuthTokenJpaRepository)
        def service = new AuthServiceImpl(users, tokens, new BCryptPasswordEncoder())

        assertThrows(RuntimeException) { service.currentUser(null, '1') }
        assertThrows(RuntimeException) { service.currentUser('Basic token', null) }
    }

    @Test
    void rejectsExpiredTokens() {
        def users = mock(UserRepository)
        def tokens = mock(AuthTokenJpaRepository)
        def service = new AuthServiceImpl(users, tokens, new BCryptPasswordEncoder())
        def expiredToken = new com.nico.podium.domain.entity.AuthTokenEntity('hash', 1L, java.time.Instant.now().minusSeconds(1))
        when(tokens.findByTokenHashAndRevokedAtIsNull(any())).thenReturn(Optional.of(expiredToken))

        assertThrows(RuntimeException) { service.currentUser('Bearer token', null) }
    }

    @Test
    void revokesTokensOnLogout() {
        def users = mock(UserRepository)
        def tokens = mock(AuthTokenJpaRepository)
        def service = new AuthServiceImpl(users, tokens, new BCryptPasswordEncoder())
        def activeToken = new com.nico.podium.domain.entity.AuthTokenEntity('hash', 1L, java.time.Instant.now().plusSeconds(3600))
        when(tokens.findByTokenHashAndRevokedAtIsNull(any())).thenReturn(Optional.of(activeToken))

        service.logout('Bearer token')

        assertNotNull(activeToken.revokedAt)
    }
}
