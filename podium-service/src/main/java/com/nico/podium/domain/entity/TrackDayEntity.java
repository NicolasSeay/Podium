package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.TrackDay;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "track_days")
public class TrackDayEntity {
    @Id
    private String id;
    private String userId;
    private String trackId;
    private String vehicleId;
    private LocalDate date;
    private String notes;
    private String conditions;

    protected TrackDayEntity() {
    }

    public TrackDayEntity(TrackDay day) {
        id = day.id();
        userId = day.userId();
        trackId = day.trackId();
        vehicleId = day.vehicleId();
        date = day.date();
        notes = day.notes();
        conditions = day.conditions();
    }

    public TrackDay toDomain() {
        return new TrackDay(id, userId, trackId, vehicleId, date, notes, conditions);
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }
}
