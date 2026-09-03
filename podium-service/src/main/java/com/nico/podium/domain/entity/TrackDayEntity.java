package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.TrackDay;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "track_days")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TrackDayEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Long trackId;
    private Long vehicleId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String notes;
    private String conditions;

    public TrackDayEntity(TrackDay day) {
        id = day.id();
        userId = day.userId();
        trackId = day.trackId();
        vehicleId = day.vehicleId();
        startDate = day.startDate();
        endDate = day.endDate();
        notes = day.notes();
        conditions = day.conditions();
    }

    public TrackDay toDomain() {
        return new TrackDay(id, userId, trackId, vehicleId, startDate, endDate, notes, conditions);
    }

}
