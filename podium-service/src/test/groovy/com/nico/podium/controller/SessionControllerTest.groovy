package com.nico.podium.controller

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.service.*
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.setup.MockMvcBuilders

import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.*
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class SessionControllerTest {
    private final AuthService auth = mock(AuthService)
    private final SessionService sessions = mock(SessionService)
    private final LapService laps = mock(LapService)
    private final mvc = MockMvcBuilders.standaloneSetup(new SessionController(auth, sessions, laps)).build()

    @Test
    void exposesSessionAndNestedLapEndpoints() {
        when(auth.currentUser(any(), any())).thenReturn(new User(1L, 'driver@example.com', 'secret', 'Driver', 'Example'))
        def session = new Session(1L, 1L, 'Open', null)
        when(sessions.get(anyLong(), eq(1L))).thenReturn(session)
        when(sessions.update(anyLong(), eq(1L), anyMap())).thenReturn(session)
        when(laps.list(anyLong(), eq(1L))).thenReturn([])
        when(laps.create(anyLong(), eq(1L), anyMap())).thenReturn(new Lap(1L, 1L, 1, 95000L))

        mvc.perform(get('/api/sessions/1').header('X-User-Id', '1')).andExpect(status().isOk())
        mvc.perform(patch('/api/sessions/1').header('X-User-Id', '1').contentType(MediaType.APPLICATION_JSON).content('{"name":"Race"}')).andExpect(status().isOk())
        mvc.perform(delete('/api/sessions/1').header('X-User-Id', '1')).andExpect(status().isNoContent())
        mvc.perform(get('/api/sessions/1/laps').header('X-User-Id', '1')).andExpect(status().isOk())
        mvc.perform(post('/api/sessions/1/laps').header('X-User-Id', '1').contentType(MediaType.APPLICATION_JSON).content('{"timeMillis":95000}')).andExpect(status().isOk())
    }
}
