package com.nico.podium.controller

import com.nico.podium.domain.PodiumModels.User
import com.nico.podium.security.TokenAuthenticationFilter
import com.nico.podium.service.AuthService
import com.nico.podium.service.UserService
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.setup.MockMvcBuilders

import static org.mockito.ArgumentMatchers.any
import static org.mockito.ArgumentMatchers.anyLong
import static org.mockito.Mockito.mock
import static org.mockito.Mockito.when
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class UserControllerTest {
    private final AuthService auth = mock(AuthService)
    private final UserService users = mock(UserService)
    private final mvc = MockMvcBuilders.standaloneSetup(new UserController(users)).addFilters(new TokenAuthenticationFilter(auth)).build()

    @Test
    void exposesCurrentUserEndpoints() {
        def user = new User(1L, 'driver@example.com', 'secret', 'Driver', 'Example')
        when(auth.currentUser(any(), any())).thenReturn(user)
        when(users.update(anyLong(), any())).thenReturn(user)

        mvc.perform(get('/api/users/me').header('Authorization', 'Bearer test-token')).andExpect(status().isOk())
        mvc.perform(patch('/api/users/me').header('Authorization', 'Bearer test-token').contentType(MediaType.APPLICATION_JSON).content('{"name":"Updated"}')).andExpect(status().isMethodNotAllowed())
    }
}
