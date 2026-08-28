package com.nico.podium.repository

import com.nico.podium.domain.PodiumModels.Vehicle
import com.nico.podium.repository.impl.*
import com.nico.podium.repository.jpa.VehicleJpaRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*

@SpringBootTest
class VehicleRepositoryTest {
    @Autowired VehicleJpaRepository vehicles

    @Test
    void managesVehiclesByOwner() {
        def repository = new VehicleRepositoryImpl(vehicles)
        def vehicle = repository.save(new Vehicle(null, 1L, 'MX-5', 'Mazda', 'ND', 2020))
        assertEquals(vehicle, repository.findById(1L).orElseThrow())
        assertEquals([vehicle], repository.findByUserId(1L))
        repository.deleteById(vehicle.id())
        assertTrue(repository.findById(vehicle.id()).isEmpty())
    }
}
