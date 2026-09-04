package com.nico.podium.controller

import com.nico.podium.domain.PodiumModels.AuthResponse
import com.nico.podium.service.AuthService
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.setup.MockMvcBuilders

import static org.mockito.ArgumentMatchers.any
import static org.mockito.ArgumentMatchers.anyString
import static org.mockito.Mockito.mock
import static org.mockito.Mockito.when
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class AuthControllerTest {
    private final AuthService auth = mock(AuthService)
    private final MockMvc mvc = MockMvcBuilders.standaloneSetup(new AuthController(auth)).build()

    @Test
    void exposesAuthenticationEndpoints() {
        when(auth.register(any())).thenReturn(new AuthResponse(null, 'token'))
        when(auth.login(any())).thenReturn(new AuthResponse(null, 'token'))
        when(auth.refresh(anyString())).thenReturn(new AuthResponse(null, 'token'))

        mvc.perform(post('/api/auth/register').contentType(MediaType.APPLICATION_JSON).content('{"email":"driver@example.com","password":"long-enough-secret","firstName":"Driver","lastName":"Example"}')).andExpect(status().isOk())
        mvc.perform(post('/api/auth/login').contentType(MediaType.APPLICATION_JSON).content('{"email":"driver@example.com","password":"secret"}')).andExpect(status().isOk())
        mvc.perform(post('/api/auth/refresh').header('Authorization', 'Bearer token')).andExpect(status().isOk())
        mvc.perform(post('/api/auth/logout').header('Authorization', 'Bearer token')).andExpect(status().isNoContent())
    }
}
