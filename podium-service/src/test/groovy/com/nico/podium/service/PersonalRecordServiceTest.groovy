package com.nico.podium.service

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.repository.*
import com.nico.podium.service.Impl.PersonalRecordServiceImpl
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.*
import static org.mockito.ArgumentMatchers.*
import static org.mockito.Mockito.*

class PersonalRecordServiceTest {
    @Test
    void storesOnlyImprovingTrackTimes() {
        def records = mock(PersonalRecordRepository)
        def sessions = mock(SessionRepository)
        def days = mock(TrackDayRepository)
        when(sessions.findById('s1')).thenReturn(Optional.of(new Session('s1', 'd1', 'Open', null)))
        when(days.findById('d1')).thenReturn(Optional.of(new TrackDay('d1', 'u1', 't1', 'v1', null, null, null)))
        when(records.findByUserId('u1')).thenReturn([])
        def service = new PersonalRecordServiceImpl(records, sessions, days)
        service.refresh('u1', 'l1', 's1', 95000L)
        verify(records).save(any(PersonalRecord))
    }
}
