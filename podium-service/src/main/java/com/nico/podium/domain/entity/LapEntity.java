package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.Lap;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "laps")
public class LapEntity {
    @Id
    private String id;
    private String sessionId;
    private Integer lapNumber;
    private Long timeMillis;

    protected LapEntity() {
    }

    public LapEntity(Lap lap) {
        id = lap.id();
        sessionId = lap.sessionId();
        lapNumber = lap.lapNumber();
        timeMillis = lap.timeMillis();
    }

    public Lap toDomain() {
        return new Lap(id, sessionId, lapNumber, timeMillis);
    }

    public String getId() {
        return id;
    }

    public String getSessionId() {
        return sessionId;
    }
}
