package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.Session;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "sessions")
public class SessionEntity {
    @Id
    private String id;
    private String trackDayId;
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

    public String getId() {
        return id;
    }

    public String getTrackDayId() {
        return trackDayId;
    }
}
