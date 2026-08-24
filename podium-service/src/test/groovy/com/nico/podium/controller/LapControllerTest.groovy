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
        when(auth.currentUser(any(), any())).thenReturn(new User('u1', 'driver@example.com', 'secret', 'Driver'))
        when(laps.update(anyString(), eq('l1'), anyMap())).thenReturn(new Lap('l1', 's1', 1, 94000L))
        mvc.perform(patch('/api/laps/l1').header('X-User-Id', 'u1').contentType(MediaType.APPLICATION_JSON).content('{"timeMillis":94000}')).andExpect(status().isOk())
        mvc.perform(delete('/api/laps/l1').header('X-User-Id', 'u1')).andExpect(status().isNoContent())
    }
}
