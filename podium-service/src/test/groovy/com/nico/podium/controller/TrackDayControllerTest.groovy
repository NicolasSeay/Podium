package com.nico.podium.controller

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.security.TokenAuthenticationFilter
import com.nico.podium.service.AuthService
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
    private final mvc = MockMvcBuilders.standaloneSetup(new TrackDayController(days)).addFilters(new TokenAuthenticationFilter(auth)).build()

    @Test
    void exposesTrackDayAggregateEndpoints() {
        when(auth.currentUser(any(), any())).thenReturn(new User(1L, 'driver@example.com', 'secret', 'Driver', 'Example'))
        def day = new TrackDay(1L, 1L, 1L, 1L, LocalDate.of(2026, 8, 24), 'notes', 'dry')
        def aggregate = new CompletedTrackDay(day, [], [:])
        when(days.list(anyLong(), anyLong(), anyLong(), any(), any())).thenReturn([aggregate])
        when(days.stats(anyLong())).thenReturn([])
        when(days.details(anyLong(), eq(1L))).thenReturn(aggregate)
        when(days.create(anyLong(), any())).thenReturn(aggregate)

        mvc.perform(get('/api/track-days?trackId=1&vehicleId=1&from=2026-01-01&to=2026-12-31').header('Authorization', 'Bearer test-token')).andExpect(status().isOk())
        mvc.perform(get('/api/track-days/stats').header('Authorization', 'Bearer test-token')).andExpect(status().isOk())
        mvc.perform(post('/api/track-days').header('Authorization', 'Bearer test-token').contentType(MediaType.APPLICATION_JSON).content('{"trackId":1,"vehicleId":1,"sessions":[]}')).andExpect(status().isOk())
        mvc.perform(post('/api/track-days').header('Authorization', 'Bearer test-token').contentType(MediaType.APPLICATION_JSON).content('{"trackId":1}')).andExpect(status().isBadRequest())
        mvc.perform(get('/api/track-days/1').header('Authorization', 'Bearer test-token')).andExpect(status().isOk())
    }
}
