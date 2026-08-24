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
        when(auth.currentUser(any(), any())).thenReturn(new User('u1', 'driver@example.com', 'secret', 'Driver'))
        def track = new Track('t1', 'u1', 'Road Atlanta', 'Georgia')
        when(tracks.list(anyString())).thenReturn([])
        when(tracks.get(anyString(), eq('t1'))).thenReturn(track)
        when(tracks.configurations(anyString(), eq('t1'))).thenReturn([])
        when(tracks.create(anyString(), anyMap())).thenReturn(track)
        when(tracks.update(anyString(), eq('t1'), anyMap())).thenReturn(track)
        when(tracks.createConfiguration(anyString(), eq('t1'), anyMap())).thenReturn(new TrackConfiguration('c1', 't1', 'Full', 4088))

        mvc.perform(get('/api/tracks').header('X-User-Id', 'u1')).andExpect(status().isOk())
        mvc.perform(post('/api/tracks').header('X-User-Id', 'u1').contentType(MediaType.APPLICATION_JSON).content('{"name":"Road Atlanta"}')).andExpect(status().isOk())
        mvc.perform(get('/api/tracks/t1').header('X-User-Id', 'u1')).andExpect(status().isOk())
        mvc.perform(patch('/api/tracks/t1').header('X-User-Id', 'u1').contentType(MediaType.APPLICATION_JSON).content('{"location":"Georgia"}')).andExpect(status().isOk())
        mvc.perform(delete('/api/tracks/t1').header('X-User-Id', 'u1')).andExpect(status().isNoContent())
        mvc.perform(get('/api/tracks/t1/configurations').header('X-User-Id', 'u1')).andExpect(status().isOk())
        mvc.perform(post('/api/tracks/t1/configurations').header('X-User-Id', 'u1').contentType(MediaType.APPLICATION_JSON).content('{"name":"Full"}')).andExpect(status().isOk())
    }
}
