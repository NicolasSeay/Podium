package com.nico.podium.controller

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.security.TokenAuthenticationFilter
import com.nico.podium.service.AuthService
import com.nico.podium.service.PersonalRecordService
import org.junit.jupiter.api.Test
import org.springframework.test.web.servlet.setup.MockMvcBuilders

import static org.mockito.ArgumentMatchers.any
import static org.mockito.Mockito.*
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class RecordControllerTest {
    private final AuthService auth = mock(AuthService)
    private final PersonalRecordService records = mock(PersonalRecordService)
    private final mvc = MockMvcBuilders.standaloneSetup(new RecordController(records)).addFilters(new TokenAuthenticationFilter(auth)).build()

    @Test
    void exposesPersonalRecordEndpoint() {
        when(auth.currentUser(any(), any())).thenReturn(new User(1L, 'driver@example.com', 'secret', 'Driver', 'Example'))
        when(records.list(1L)).thenReturn([new PersonalRecord(1L, 1L, 1L, 1L, 1L, 94000L)])
        mvc.perform(get('/api/records').header('X-User-Id', '1')).andExpect(status().isOk())
        verify(records).list(1L)
    }
}
