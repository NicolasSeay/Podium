package com.nico.podium.controller

import com.nico.podium.service.AuthService
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.setup.MockMvcBuilders

import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.*
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class AuthControllerTest {
    private final AuthService auth = mock(AuthService)
    private final MockMvc mvc = MockMvcBuilders.standaloneSetup(new AuthController(auth)).build()

    @Test
    void exposesAuthenticationEndpoints() {
        when(auth.register(any(), any(), any())).thenReturn([token: 'token'])
        when(auth.login(any(), any())).thenReturn([token: 'token'])
        when(auth.refresh(anyString())).thenReturn([token: 'token'])

        mvc.perform(post('/api/auth/register').contentType(MediaType.APPLICATION_JSON).content('{"email":"driver@example.com","password":"secret"}')).andExpect(status().isOk())
        mvc.perform(post('/api/auth/login').contentType(MediaType.APPLICATION_JSON).content('{"email":"driver@example.com","password":"secret"}')).andExpect(status().isOk())
        mvc.perform(post('/api/auth/refresh').header('Authorization', 'Bearer token')).andExpect(status().isOk())
        mvc.perform(post('/api/auth/logout').header('Authorization', 'Bearer token')).andExpect(status().isNoContent())
    }
}
