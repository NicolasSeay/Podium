package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.PersonalRecord;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "personal_records")
public class PersonalRecordEntity {
    @Id
    private String id;
    private String userId;
    private String lapId;
    private String trackId;
    private String vehicleId;
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

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }
}
