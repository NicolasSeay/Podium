package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.PersonalRecord;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "personal_records")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PersonalRecordEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Long lapId;
    private Long trackId;
    private Long vehicleId;
    private Long timeMillis;

    public PersonalRecordEntity(PersonalRecord record) {
        id = record.id();
        userId = record.userId();
        lapId = record.lapId();
        trackId = record.trackId();
        vehicleId = record.vehicleId();
        timeMillis = record.timeMillis();
    }

    public PersonalRecord toDomain() {
        return new PersonalRecord(id, userId, lapId, trackId, vehicleId, timeMillis);
    }

}
