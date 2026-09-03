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
        when(auth.currentUser(any(), any())).thenReturn(new User(1L, 'driver@example.com', 'secret', 'Driver', 'Example'))
        def day = new TrackDay(1L, 1L, 1L, 1L, LocalDate.of(2026, 8, 24), 'notes', 'dry')
        when(days.list(anyLong(), any(), any(), any(), any())).thenReturn([])
        when(days.stats(anyLong())).thenReturn([])
        when(days.get(anyLong(), eq(1L))).thenReturn(day)
        when(days.create(anyLong(), anyMap())).thenReturn(day)
        when(days.update(anyLong(), eq(1L), anyMap())).thenReturn(day)
        when(sessions.list(anyLong(), eq(1L))).thenReturn([])
        when(sessions.create(anyLong(), eq(1L), anyMap())).thenReturn(new Session(1L, 1L, 'Open', null))

        mvc.perform(get('/api/track-days?trackId=1&vehicleId=1&from=2026-01-01&to=2026-12-31').header('X-User-Id', '1')).andExpect(status().isOk())
        mvc.perform(get('/api/track-days/stats').header('X-User-Id', '1')).andExpect(status().isOk())
        mvc.perform(post('/api/track-days').header('X-User-Id', '1').contentType(MediaType.APPLICATION_JSON).content('{"trackId":1}')).andExpect(status().isOk())
        mvc.perform(get('/api/track-days/1').header('X-User-Id', '1')).andExpect(status().isOk())
        mvc.perform(patch('/api/track-days/1').header('X-User-Id', '1').contentType(MediaType.APPLICATION_JSON).content('{"notes":"updated"}')).andExpect(status().isOk())
        mvc.perform(delete('/api/track-days/1').header('X-User-Id', '1')).andExpect(status().isNoContent())
        mvc.perform(get('/api/track-days/1/sessions').header('X-User-Id', '1')).andExpect(status().isOk())
        mvc.perform(post('/api/track-days/1/sessions').header('X-User-Id', '1').contentType(MediaType.APPLICATION_JSON).content('{"name":"Open"}')).andExpect(status().isOk())
    }
}
