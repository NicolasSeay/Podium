package com.nico.podium.controller

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.security.TokenAuthenticationFilter
import com.nico.podium.service.AuthService
import com.nico.podium.service.SessionService
import com.nico.podium.service.TrackDayService
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.setup.MockMvcBuilders

import java.time.LocalDate

import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.mock
import static org.mockito.Mockito.when
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class TrackDayControllerTest {
    private final AuthService auth = mock(AuthService)
    private final TrackDayService days = mock(TrackDayService)
    private final SessionService sessions = mock(SessionService)
    private final mvc = MockMvcBuilders.standaloneSetup(new TrackDayController(days, sessions)).addFilters(new TokenAuthenticationFilter(auth)).build()

    @Test
    void exposesTrackDayAndNestedSessionEndpoints() {
        when(auth.currentUser(any(), any())).thenReturn(new User(1L, 'driver@example.com', 'secret', 'Driver', 'Example'))
        def day = new TrackDay(1L, 1L, 1L, 1L, LocalDate.of(2026, 8, 24), 'notes', 'dry')
        when(days.list(anyLong(), anyLong(), anyLong(), any(), any())).thenReturn([])
        when(days.stats(anyLong())).thenReturn([])
        when(days.get(anyLong(), eq(1L))).thenReturn(day)
        when(days.create(anyLong(), any())).thenReturn(day)
        when(days.update(anyLong(), eq(1L), any())).thenReturn(day)
        when(sessions.list(anyLong(), eq(1L))).thenReturn([])
        when(sessions.create(anyLong(), eq(1L), any())).thenReturn(new Session(1L, 1L, 'Open', null))

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
