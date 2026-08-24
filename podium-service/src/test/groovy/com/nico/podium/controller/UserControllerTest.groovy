package com.nico.podium.controller

import com.nico.podium.domain.PodiumModels.User
import com.nico.podium.service.*
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.setup.MockMvcBuilders

import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.*
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class UserControllerTest {
    private final AuthService auth = mock(AuthService)
    private final UserService users = mock(UserService)
    private final mvc = MockMvcBuilders.standaloneSetup(new UserController(auth, users)).build()

    @Test
    void exposesCurrentUserEndpoints() {
        def user = new User('u1', 'driver@example.com', 'secret', 'Driver')
        when(auth.currentUser(any(), any())).thenReturn(user)
        when(users.update(anyString(), anyMap())).thenReturn(user)

        mvc.perform(get('/api/users/me').header('X-User-Id', 'u1')).andExpect(status().isOk())
        mvc.perform(patch('/api/users/me').header('X-User-Id', 'u1').contentType(MediaType.APPLICATION_JSON).content('{"name":"Updated"}')).andExpect(status().isOk())
    }
}
