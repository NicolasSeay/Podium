package com.nico.podium.repository

import com.nico.podium.domain.PodiumModels.PersonalRecord
import com.nico.podium.repository.Impl.*
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*

class PersonalRecordRepositoryTest {
    @Test
    void findsRecordsByOwner() {
        def repository = new PersonalRecordRepositoryImpl(new InMemoryDataStoreImpl())
        def record = new PersonalRecord('r1', 'u1', 'l1', 't1', 'v1', 95000L)
        repository.save(record)
        assertEquals([record], repository.findByUserId('u1'))
        assertTrue(repository.findByUserId('u2').isEmpty())
    }
}
