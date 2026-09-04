package com.nico.podium.controller

import com.nico.podium.domain.PodiumModels.User
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder

import static org.junit.jupiter.api.Assertions.assertEquals
import static org.junit.jupiter.api.Assertions.assertThrows

class ControllerSupportTest {
    private final TestController controller = new TestController()

    @AfterEach
    void clearAuthentication() {
        SecurityContextHolder.clearContext()
    }

    @Test
    void returnsTheAuthenticatedUserAndId() {
        def user = new User(7L, 'driver@example.com', 'hash', 'Driver', 'Example')
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(user, null, [])
        )

        assertEquals(user, controller.exposedUser())
        assertEquals(7L, controller.exposedUserId())
    }

    @Test
    void rejectsMissingOrUnexpectedPrincipals() {
        assertThrows(IllegalStateException) { controller.exposedUser() }

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken('driver@example.com', null, [])
        )

        assertThrows(IllegalStateException) { controller.exposedUser() }
    }

    private static class TestController extends ControllerSupport {
        User exposedUser() {
            return currentUser()
        }

        Long exposedUserId() {
            return userId()
        }
    }
}
