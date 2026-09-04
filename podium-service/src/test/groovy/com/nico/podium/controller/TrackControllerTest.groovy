package com.nico.podium.controller

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.security.TokenAuthenticationFilter
import com.nico.podium.service.AuthService
import com.nico.podium.service.TrackService
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.setup.MockMvcBuilders

import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.mock
import static org.mockito.Mockito.when
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class TrackControllerTest {
    private final AuthService auth = mock(AuthService)
    private final TrackService tracks = mock(TrackService)
    private final mvc = MockMvcBuilders.standaloneSetup(new TrackController(tracks)).addFilters(new TokenAuthenticationFilter(auth)).build()

    @Test
    void exposesTrackEndpoints() {
        when(auth.currentUser(any(), any())).thenReturn(new User(1L, 'driver@example.com', 'secret', 'Driver', 'Example'))
        def track = new Track(1L, 'Road Atlanta', 'Braselton', 'United States', 2.54G)
        when(tracks.list(anyLong())).thenReturn([])
        when(tracks.get(anyLong(), eq(1L))).thenReturn(track)
        when(tracks.create(anyLong(), any())).thenReturn(track)
        when(tracks.update(anyLong(), eq(1L), any())).thenReturn(track)

        mvc.perform(get('/api/tracks').header('Authorization', 'Bearer test-token')).andExpect(status().isOk())
        mvc.perform(post('/api/tracks').header('Authorization', 'Bearer test-token').contentType(MediaType.APPLICATION_JSON).content('{"name":"Road Atlanta"}')).andExpect(status().isOk())
        mvc.perform(get('/api/tracks/1').header('Authorization', 'Bearer test-token')).andExpect(status().isOk())
        mvc.perform(patch('/api/tracks/1').header('Authorization', 'Bearer test-token').contentType(MediaType.APPLICATION_JSON).content('{"city":"Braselton"}')).andExpect(status().isOk())
        mvc.perform(delete('/api/tracks/1').header('Authorization', 'Bearer test-token')).andExpect(status().isNoContent())
    }
}
