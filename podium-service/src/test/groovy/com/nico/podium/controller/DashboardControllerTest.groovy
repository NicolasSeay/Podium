package com.nico.podium.controller

import com.nico.podium.domain.PodiumModels.User
import com.nico.podium.service.*
import org.junit.jupiter.api.Test
import org.springframework.test.web.servlet.setup.MockMvcBuilders

import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.*
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class DashboardControllerTest {
    private final AuthService auth = mock(AuthService)
    private final DashboardService dashboard = mock(DashboardService)
    private final mvc = MockMvcBuilders.standaloneSetup(new DashboardController(auth, dashboard)).build()

    @Test
    void exposesDashboardEndpoint() {
        when(auth.currentUser(any(), any())).thenReturn(new User(1L, 'driver@example.com', 'secret', 'Driver', 'Example'))
        when(dashboard.get(1L)).thenReturn([totalTrackDays: 0])
        mvc.perform(get('/api/dashboard').header('X-User-Id', '1')).andExpect(status().isOk())
        verify(dashboard).get(1L)
    }
}
