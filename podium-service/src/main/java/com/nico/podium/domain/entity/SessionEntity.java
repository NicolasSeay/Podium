package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.Session;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;

@Entity
@Table(name = "sessions")
public class SessionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long trackDayId;
    private String name;
    private String notes;

    protected SessionEntity() {
    }

    public SessionEntity(Session session) {
        id = session.id();
        trackDayId = session.trackDayId();
        name = session.name();
        notes = session.notes();
    }

    public Session toDomain() {
        return new Session(id, trackDayId, name, notes);
    }

    public Long getId() {
        return id;
    }

    public Long getTrackDayId() {
        return trackDayId;
    }
}
