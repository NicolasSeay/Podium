package com.nico.podium.service

import com.nico.podium.service.Impl.ServiceSupportImpl
import org.junit.jupiter.api.Test

import java.time.LocalDate

import static org.junit.jupiter.api.Assertions.*

class ServiceSupportImplTest {
    @Test
    void parsesSharedRequestValues() {
        assertEquals('Road Atlanta', ServiceSupportImpl.required([name: 'Road Atlanta'], 'name'))
        assertEquals(4088, ServiceSupportImpl.integer([lengthMeters: 4088], 'lengthMeters', null))
        assertEquals(LocalDate.of(2026, 8, 24), ServiceSupportImpl.date([date: '2026-08-24'], 'date', null))
    }
}
