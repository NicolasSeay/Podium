package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.PersonalRecord;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;

@Entity
@Table(name = "personal_records")
public class PersonalRecordEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Long lapId;
    private Long trackId;
    private Long vehicleId;
    private Long timeMillis;

    protected PersonalRecordEntity() {
    }

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

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }
}
