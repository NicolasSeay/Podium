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
        when(auth.currentUser(any(), any())).thenReturn(new User(1L, 'driver@example.com', 'secret', 'Driver', 'Example'))
        def vehicle = new Vehicle(1L, 1L, 'MX-5', 'Mazda', 'MX-5', 'ND', 2020)
        when(vehicles.list(anyLong())).thenReturn([])
        when(vehicles.get(anyLong(), eq(1L))).thenReturn(vehicle)
        when(vehicles.create(anyLong(), anyMap())).thenReturn(vehicle)
        when(vehicles.update(anyLong(), eq(1L), anyMap())).thenReturn(vehicle)

        mvc.perform(get('/api/vehicles').header('X-User-Id', '1')).andExpect(status().isOk())
        mvc.perform(post('/api/vehicles').header('X-User-Id', '1').contentType(MediaType.APPLICATION_JSON).content('{"name":"MX-5"}')).andExpect(status().isOk())
        mvc.perform(get('/api/vehicles/1').header('X-User-Id', '1')).andExpect(status().isOk())
        mvc.perform(patch('/api/vehicles/1').header('X-User-Id', '1').contentType(MediaType.APPLICATION_JSON).content('{"year":2020}')).andExpect(status().isOk())
        mvc.perform(delete('/api/vehicles/1').header('X-User-Id', '1')).andExpect(status().isNoContent())
    }
}
