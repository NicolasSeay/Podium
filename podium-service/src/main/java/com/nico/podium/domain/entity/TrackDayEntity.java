package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.TrackDay;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "track_days")
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

    protected TrackDayEntity() {
    }

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

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }
}
