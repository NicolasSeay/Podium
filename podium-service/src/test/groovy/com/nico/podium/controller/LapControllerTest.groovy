package com.nico.podium.controller

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.security.TokenAuthenticationFilter
import com.nico.podium.service.AuthService
import com.nico.podium.service.LapService
import org.junit.jupiter.api.Test
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.setup.MockMvcBuilders

import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.mock
import static org.mockito.Mockito.when
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class LapControllerTest {
    private final AuthService auth = mock(AuthService)
    private final LapService laps = mock(LapService)
    private final mvc = MockMvcBuilders.standaloneSetup(new LapController(laps)).addFilters(new TokenAuthenticationFilter(auth)).build()

    @Test
    void exposesLapUpdateAndDeleteEndpoints() {
        when(auth.currentUser(any(), any())).thenReturn(new User(1L, 'driver@example.com', 'secret', 'Driver', 'Example'))
        when(laps.update(anyLong(), eq(1L), any())).thenReturn(new Lap(1L, 1L, 1, 94000L))
        mvc.perform(patch('/api/laps/1').header('Authorization', 'Bearer test-token').contentType(MediaType.APPLICATION_JSON).content('{"timeMillis":94000}')).andExpect(status().isOk())
        mvc.perform(delete('/api/laps/1').header('Authorization', 'Bearer test-token')).andExpect(status().isNoContent())
    }
}
