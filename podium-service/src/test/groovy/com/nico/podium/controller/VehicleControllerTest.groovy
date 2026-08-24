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

class VehicleControllerTest {
    private final AuthService auth = mock(AuthService)
    private final VehicleService vehicles = mock(VehicleService)
    private final mvc = MockMvcBuilders.standaloneSetup(new VehicleController(auth, vehicles)).build()

    @Test
    void exposesVehicleCrudEndpoints() {
        when(auth.currentUser(any(), any())).thenReturn(new User('u1', 'driver@example.com', 'secret', 'Driver'))
        def vehicle = new Vehicle('v1', 'u1', 'MX-5', 'Mazda', 'MX-5', 2020)
        when(vehicles.list(anyString())).thenReturn([])
        when(vehicles.get(anyString(), eq('v1'))).thenReturn(vehicle)
        when(vehicles.create(anyString(), anyMap())).thenReturn(vehicle)
        when(vehicles.update(anyString(), eq('v1'), anyMap())).thenReturn(vehicle)

        mvc.perform(get('/api/vehicles').header('X-User-Id', 'u1')).andExpect(status().isOk())
        mvc.perform(post('/api/vehicles').header('X-User-Id', 'u1').contentType(MediaType.APPLICATION_JSON).content('{"name":"MX-5"}')).andExpect(status().isOk())
        mvc.perform(get('/api/vehicles/v1').header('X-User-Id', 'u1')).andExpect(status().isOk())
        mvc.perform(patch('/api/vehicles/v1').header('X-User-Id', 'u1').contentType(MediaType.APPLICATION_JSON).content('{"year":2020}')).andExpect(status().isOk())
        mvc.perform(delete('/api/vehicles/v1').header('X-User-Id', 'u1')).andExpect(status().isNoContent())
    }
}
