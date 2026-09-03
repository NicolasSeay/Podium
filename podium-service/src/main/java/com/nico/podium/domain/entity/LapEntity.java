package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.Lap;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "laps")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LapEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long sessionId;
    private Integer lapNumber;
    private Long timeMillis;

    public LapEntity(Lap lap) {
        id = lap.id();
        sessionId = lap.sessionId();
        lapNumber = lap.lapNumber();
        timeMillis = lap.timeMillis();
    }

    public Lap toDomain() {
        return new Lap(id, sessionId, lapNumber, timeMillis);
    }

}
