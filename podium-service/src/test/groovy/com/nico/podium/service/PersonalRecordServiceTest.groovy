package com.nico.podium.service

import com.nico.podium.domain.PodiumModels.*
import com.nico.podium.repository.*
import com.nico.podium.service.impl.PersonalRecordServiceImpl
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
        when(sessions.findById(1L)).thenReturn(Optional.of(new Session(1L, 1L, 'Open', null)))
        when(days.findById(1L)).thenReturn(Optional.of(new TrackDay(1L, 1L, 1L, 1L, null, null, null)))
        when(records.findByUserId(1L)).thenReturn([])
        def service = new PersonalRecordServiceImpl(records, sessions, days)
        service.refresh(1L, 1L, 1L, 95000L)
        verify(records).save(any(PersonalRecord))
    }
}
