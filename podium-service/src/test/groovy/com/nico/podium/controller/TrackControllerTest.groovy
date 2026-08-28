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

class TrackControllerTest {
    private final AuthService auth = mock(AuthService)
    private final TrackService tracks = mock(TrackService)
    private final mvc = MockMvcBuilders.standaloneSetup(new TrackController(auth, tracks)).build()

    @Test
    void exposesTrackAndConfigurationEndpoints() {
        when(auth.currentUser(any(), any())).thenReturn(new User(1L, 'driver@example.com', 'secret', 'Driver', 'Example'))
        def track = new Track(1L, 1L, 'Road Atlanta', 'Georgia')
        when(tracks.list(anyLong())).thenReturn([])
        when(tracks.get(anyLong(), eq(1L))).thenReturn(track)
        when(tracks.configurations(anyLong(), eq(1L))).thenReturn([])
        when(tracks.create(anyLong(), anyMap())).thenReturn(track)
        when(tracks.update(anyLong(), eq(1L), anyMap())).thenReturn(track)
        when(tracks.createConfiguration(anyLong(), eq(1L), anyMap())).thenReturn(new TrackConfiguration(1L, 1L, 'Full', 4088))

        mvc.perform(get('/api/tracks').header('X-User-Id', '1')).andExpect(status().isOk())
        mvc.perform(post('/api/tracks').header('X-User-Id', '1').contentType(MediaType.APPLICATION_JSON).content('{"name":"Road Atlanta"}')).andExpect(status().isOk())
        mvc.perform(get('/api/tracks/1').header('X-User-Id', '1')).andExpect(status().isOk())
        mvc.perform(patch('/api/tracks/1').header('X-User-Id', '1').contentType(MediaType.APPLICATION_JSON).content('{"location":"Georgia"}')).andExpect(status().isOk())
        mvc.perform(delete('/api/tracks/1').header('X-User-Id', '1')).andExpect(status().isNoContent())
        mvc.perform(get('/api/tracks/1/configurations').header('X-User-Id', '1')).andExpect(status().isOk())
        mvc.perform(post('/api/tracks/1/configurations').header('X-User-Id', '1').contentType(MediaType.APPLICATION_JSON).content('{"name":"Full"}')).andExpect(status().isOk())
    }
}
