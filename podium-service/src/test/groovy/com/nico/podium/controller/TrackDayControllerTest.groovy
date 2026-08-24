package com.nico.podium.controller

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.service.*
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import java.time.LocalDate

import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.*
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class TrackDayControllerTest {
    private final AuthService auth = mock(AuthService)
    private final TrackDayService days = mock(TrackDayService)
    private final SessionService sessions = mock(SessionService)
    private final mvc = MockMvcBuilders.standaloneSetup(new TrackDayController(auth, days, sessions)).build()

    @Test
    void exposesTrackDayAndNestedSessionEndpoints() {
        when(auth.currentUser(any(), any())).thenReturn(new User('u1', 'driver@example.com', 'secret', 'Driver'))
        def day = new TrackDay('d1', 'u1', 't1', 'v1', LocalDate.of(2026, 8, 24), 'notes', 'dry')
        when(days.list(anyString(), any(), any(), any(), any())).thenReturn([])
        when(days.get(anyString(), eq('d1'))).thenReturn(day)
        when(days.create(anyString(), anyMap())).thenReturn(day)
        when(days.update(anyString(), eq('d1'), anyMap())).thenReturn(day)
        when(sessions.list(anyString(), eq('d1'))).thenReturn([])
        when(sessions.create(anyString(), eq('d1'), anyMap())).thenReturn(new Session('s1', 'd1', 'Open', null))

        mvc.perform(get('/api/track-days?trackId=t1&vehicleId=v1&from=2026-01-01&to=2026-12-31').header('X-User-Id', 'u1')).andExpect(status().isOk())
        mvc.perform(post('/api/track-days').header('X-User-Id', 'u1').contentType(MediaType.APPLICATION_JSON).content('{"trackId":"t1"}')).andExpect(status().isOk())
        mvc.perform(get('/api/track-days/d1').header('X-User-Id', 'u1')).andExpect(status().isOk())
        mvc.perform(patch('/api/track-days/d1').header('X-User-Id', 'u1').contentType(MediaType.APPLICATION_JSON).content('{"notes":"updated"}')).andExpect(status().isOk())
        mvc.perform(delete('/api/track-days/d1').header('X-User-Id', 'u1')).andExpect(status().isNoContent())
        mvc.perform(get('/api/track-days/d1/sessions').header('X-User-Id', 'u1')).andExpect(status().isOk())
        mvc.perform(post('/api/track-days/d1/sessions').header('X-User-Id', 'u1').contentType(MediaType.APPLICATION_JSON).content('{"name":"Open"}')).andExpect(status().isOk())
    }
}
