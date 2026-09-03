package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.Session;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "sessions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SessionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long trackDayId;
    private String name;
    private String notes;
    private LocalDate sessionDate;

    public SessionEntity(Session session) {
        id = session.id();
        trackDayId = session.trackDayId();
        name = session.name();
        notes = session.notes();
        sessionDate = session.sessionDate();
    }

    public Session toDomain() {
        return new Session(id, trackDayId, name, notes, sessionDate);
    }

}
