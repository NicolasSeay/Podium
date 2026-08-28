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

class LapControllerTest {
    private final AuthService auth = mock(AuthService)
    private final LapService laps = mock(LapService)
    private final mvc = MockMvcBuilders.standaloneSetup(new LapController(auth, laps)).build()

    @Test
    void exposesLapUpdateAndDeleteEndpoints() {
        when(auth.currentUser(any(), any())).thenReturn(new User(1L, 'driver@example.com', 'secret', 'Driver', 'Example'))
        when(laps.update(anyLong(), eq(1L), anyMap())).thenReturn(new Lap(1L, 1L, 1, 94000L))
        mvc.perform(patch('/api/laps/1').header('X-User-Id', '1').contentType(MediaType.APPLICATION_JSON).content('{"timeMillis":94000}')).andExpect(status().isOk())
        mvc.perform(delete('/api/laps/1').header('X-User-Id', '1')).andExpect(status().isNoContent())
    }
}
