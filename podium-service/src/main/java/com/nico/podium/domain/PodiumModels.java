package com.nico.podium.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;

public final class PodiumModels {

    private PodiumModels() {
    }

    public record User(Long id, String email, @JsonIgnore String password, String firstName, String lastName) {
    }

    public record Track(Long id, Long userId, String name, String location) {
    }

    public record TrackConfiguration(Long id, Long trackId, String name, Integer lengthMeters) {
    }

    public record Vehicle(Long id, Long userId, String name, String make, String model, Integer year) {
    }

    public record TrackDay(Long id, Long userId, Long trackId, Long vehicleId,
                           LocalDate date, String notes, String conditions) {
    }

    public record Session(Long id, Long trackDayId, String name, String notes) {
    }

    public record Lap(Long id, Long sessionId, Integer lapNumber, Long timeMillis) {
    }

    public record PersonalRecord(Long id, Long userId, Long lapId, Long trackId,
                                 Long vehicleId, Long timeMillis) {
    }
}