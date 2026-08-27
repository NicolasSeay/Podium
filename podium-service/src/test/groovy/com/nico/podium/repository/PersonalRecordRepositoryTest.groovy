package com.nico.podium.repository

import com.nico.podium.domain.PodiumModels.PersonalRecord
import com.nico.podium.repository.impl.*
import com.nico.podium.repository.jpa.PersonalRecordJpaRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*

@SpringBootTest
class PersonalRecordRepositoryTest {
    @Autowired PersonalRecordJpaRepository records

    @Test
    void findsRecordsByOwner() {
        def repository = new PersonalRecordRepositoryImpl(records)
        def record = new PersonalRecord('r1', 'u1', 'l1', 't1', 'v1', 95000L)
        repository.save(record)
        assertEquals([record], repository.findByUserId('u1'))
        assertTrue(repository.findByUserId('u2').isEmpty())
    }
}
