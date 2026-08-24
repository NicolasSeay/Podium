package com.nico.podium.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;

public final class PodiumModels {

    private PodiumModels() {
    }

    public record User(String id, String email, @JsonIgnore String password, String name) {
    }

    public record Track(String id, String userId, String name, String location) {
    }

    public record TrackConfiguration(String id, String trackId, String name, Integer lengthMeters) {
    }

    public record Vehicle(String id, String userId, String name, String make, String model, Integer year) {
    }

    public record TrackDay(String id, String userId, String trackId, String vehicleId,
                           LocalDate date, String notes, String conditions) {
    }

    public record Session(String id, String trackDayId, String name, String notes) {
    }

    public record Lap(String id, String sessionId, Integer lapNumber, Long timeMillis) {
    }

    public record PersonalRecord(String id, String userId, String lapId, String trackId,
                                 String vehicleId, Long timeMillis) {
    }
}