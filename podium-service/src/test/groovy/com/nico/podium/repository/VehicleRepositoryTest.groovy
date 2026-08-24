package com.nico.podium.repository

import com.nico.podium.domain.PodiumModels.Vehicle
import com.nico.podium.repository.Impl.*
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*

class VehicleRepositoryTest {
    @Test
    void managesVehiclesByOwner() {
        def repository = new VehicleRepositoryImpl(new InMemoryDataStoreImpl())
        def vehicle = new Vehicle('v1', 'u1', 'MX-5', 'Mazda', 'ND', 2020)
        repository.save(vehicle)
        assertEquals(vehicle, repository.findById('v1').orElseThrow())
        assertEquals([vehicle], repository.findByUserId('u1'))
        repository.deleteById('v1')
        assertTrue(repository.findById('v1').isEmpty())
    }
}
