package com.nico.podium.service

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.repository.LapRepository
import com.nico.podium.service.Impl.LapServiceImpl
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*
import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.*

class LapServiceTest {
    @Test
    void rejectsNonPositiveLapTimes() {
        def laps = mock(LapRepository)
        def sessions = mock(SessionService)
        def records = mock(PersonalRecordService)
        when(sessions.get('u1', 's1')).thenReturn(new Session('s1', 'd1', 'Open', null))
        def service = new LapServiceImpl(laps, sessions, records)
        assertThrows(Exception) { service.create('u1', 's1', [timeMillis: 0]) }
        verify(laps, never()).save(any(Lap))
    }
}
