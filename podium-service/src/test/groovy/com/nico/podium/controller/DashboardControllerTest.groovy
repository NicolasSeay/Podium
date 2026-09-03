package com.nico.podium.controller

import com.nico.podium.domain.PodiumModels.User
import com.nico.podium.security.TokenAuthenticationFilter
import com.nico.podium.service.AuthService
import com.nico.podium.service.DashboardService
import org.junit.jupiter.api.Test
import org.springframework.test.web.servlet.setup.MockMvcBuilders

import static org.mockito.ArgumentMatchers.any
import static org.mockito.Mockito.*
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class DashboardControllerTest {
    private final AuthService auth = mock(AuthService)
    private final DashboardService dashboard = mock(DashboardService)
    private final mvc = MockMvcBuilders.standaloneSetup(new DashboardController(dashboard)).addFilters(new TokenAuthenticationFilter(auth)).build()

    @Test
    void exposesDashboardEndpoint() {
        when(auth.currentUser(any(), any())).thenReturn(new User(1L, 'driver@example.com', 'secret', 'Driver', 'Example'))
        when(dashboard.get(1L, 10L, 20L)).thenReturn(new com.nico.podium.domain.PodiumModels.DashboardResponse([], 0, 0, 0, 0L, []))
        mvc.perform(get('/api/dashboard').header('X-User-Id', '1').param('trackId', '10').param('vehicleId', '20')).andExpect(status().isOk())
        verify(dashboard).get(1L, 10L, 20L)
    }
}
