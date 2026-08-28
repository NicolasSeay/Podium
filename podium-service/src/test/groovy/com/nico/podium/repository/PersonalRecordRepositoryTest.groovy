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
        def record = repository.save(new PersonalRecord(null, 1L, 1L, 1L, 1L, 95000L))
        assertEquals([record], repository.findByUserId(1L))
        assertTrue(repository.findByUserId(2L).isEmpty())
    }
}
