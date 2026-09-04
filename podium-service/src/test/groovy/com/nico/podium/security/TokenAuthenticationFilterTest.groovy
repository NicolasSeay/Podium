package com.nico.podium.security

import com.nico.podium.domain.PodiumModels.User
import com.nico.podium.service.AuthService
import jakarta.servlet.FilterChain
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.mock.web.MockFilterChain
import org.springframework.security.core.context.SecurityContextHolder

import static org.junit.jupiter.api.Assertions.assertEquals
import static org.junit.jupiter.api.Assertions.assertNull
import static org.mockito.ArgumentMatchers.isNull
import static org.mockito.Mockito.mock
import static org.mockito.Mockito.verify
import static org.mockito.Mockito.when

class TokenAuthenticationFilterTest {
    private final AuthService auth = mock(AuthService)
    private final TokenAuthenticationFilter filter = new TokenAuthenticationFilter(auth)
    private final MockHttpServletResponse response = new MockHttpServletResponse()

    @BeforeEach
    void clearExistingAuthentication() {
        SecurityContextHolder.clearContext()
    }

    @AfterEach
    void clearAuthentication() {
        SecurityContextHolder.clearContext()
    }

    @Test
    void authenticatesAValidAuthorizationHeader() {
        def request = new MockHttpServletRequest()
        request.addHeader('Authorization', 'Bearer token')
        def chain = new MockFilterChain()
        def user = new User(7L, 'driver@example.com', 'hash', 'Driver', 'Example')
        when(auth.currentUser('Bearer token', null)).thenReturn(user)

        filter.doFilter(request, response, chain)

        assertEquals(user, SecurityContextHolder.getContext().getAuthentication().principal)
        assertEquals(request, chain.getRequest())
        verify(auth).currentUser('Bearer token', null)
    }

    @Test
    void continuesWithoutAuthenticationWhenHeaderIsAbsent() {
        def request = new MockHttpServletRequest()
        def chain = new MockFilterChain()

        filter.doFilter(request, response, chain)

        assertNull(SecurityContextHolder.getContext().getAuthentication())
        assertEquals(request, chain.getRequest())
    }

    @Test
    void clearsAuthenticationWhenTheTokenIsRejected() {
        def request = new MockHttpServletRequest()
        request.addHeader('Authorization', 'Bearer expired')
        def chain = mock(FilterChain)
        when(auth.currentUser('Bearer expired', null)).thenThrow(new IllegalArgumentException('expired'))

        filter.doFilter(request, response, chain)

        assertNull(SecurityContextHolder.getContext().getAuthentication())
        verify(chain).doFilter(request, response)
    }
}
