package com.nico.podium.service

import com.nico.podium.domain.PodiumModels.Vehicle
import com.nico.podium.repository.VehicleRepository
import com.nico.podium.service.impl.VehicleServiceImpl
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*
import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.*

class VehicleServiceTest {
    @Test
    void createsAndUpdatesVehicle() {
        def vehicles = mock(VehicleRepository)
        when(vehicles.save(any(Vehicle))).thenAnswer { it.arguments[0] }
        def service = new VehicleServiceImpl(vehicles)
        def vehicle = service.create(1L, [name: 'MX-5', make: 'Mazda'])
        when(vehicles.findById(vehicle.id())).thenReturn(Optional.of(vehicle))
        def updated = service.update(1L, vehicle.id(), [model: 'ND'])
        assertEquals('ND', updated.model())
        verify(vehicles, times(2)).save(any(Vehicle))
    }
}
