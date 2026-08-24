package com.nico.podium.controller

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.service.*
import org.junit.jupiter.api.Test
import org.springframework.test.web.servlet.setup.MockMvcBuilders

import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.*
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

class RecordControllerTest {
    private final AuthService auth = mock(AuthService)
    private final PersonalRecordService records = mock(PersonalRecordService)
    private final mvc = MockMvcBuilders.standaloneSetup(new RecordController(auth, records)).build()

    @Test
    void exposesPersonalRecordEndpoint() {
        when(auth.currentUser(any(), any())).thenReturn(new User('u1', 'driver@example.com', 'secret', 'Driver'))
        when(records.list('u1')).thenReturn([new PersonalRecord('r1', 'u1', 'l1', 't1', 'v1', 94000L)])
        mvc.perform(get('/api/records').header('X-User-Id', 'u1')).andExpect(status().isOk())
        verify(records).list('u1')
    }
}
