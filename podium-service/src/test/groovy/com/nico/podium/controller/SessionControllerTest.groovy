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
        when(auth.currentUser(any(), any())).thenReturn(new User('u1', 'driver@example.com', 'secret', 'Driver'))
        def session = new Session('s1', 'd1', 'Open', null)
        when(sessions.get(anyString(), eq('s1'))).thenReturn(session)
        when(sessions.update(anyString(), eq('s1'), anyMap())).thenReturn(session)
        when(laps.list(anyString(), eq('s1'))).thenReturn([])
        when(laps.create(anyString(), eq('s1'), anyMap())).thenReturn(new Lap('l1', 's1', 1, 95000L))

        mvc.perform(get('/api/sessions/s1').header('X-User-Id', 'u1')).andExpect(status().isOk())
        mvc.perform(patch('/api/sessions/s1').header('X-User-Id', 'u1').contentType(MediaType.APPLICATION_JSON).content('{"name":"Race"}')).andExpect(status().isOk())
        mvc.perform(delete('/api/sessions/s1').header('X-User-Id', 'u1')).andExpect(status().isNoContent())
        mvc.perform(get('/api/sessions/s1/laps').header('X-User-Id', 'u1')).andExpect(status().isOk())
        mvc.perform(post('/api/sessions/s1/laps').header('X-User-Id', 'u1').contentType(MediaType.APPLICATION_JSON).content('{"timeMillis":95000}')).andExpect(status().isOk())
    }
}
