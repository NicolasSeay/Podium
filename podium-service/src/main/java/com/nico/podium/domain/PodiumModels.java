package com.nico.podium.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public final class PodiumModels {

    private PodiumModels() {
    }

    public record User(Long id, String email, @JsonIgnore String password, String firstName, String lastName) {
    }

    public record RegisterRequest(String email, String password, String firstName, String lastName) {
    }

    public record LoginRequest(String email, String password) {
    }

    public record AuthResponse(User user, String token) {
    }

    public record UserUpdateRequest(String firstName, String lastName) {
    }

    public record Track(Long id, String name, String city, String country, BigDecimal lengthMiles) {
    }

    public record TrackRequest(String name, String city, String country, BigDecimal lengthMiles) {
    }

    public record Vehicle(Long id, Long userId, String name, String make, String model, String trim, Integer year) {
    }

    public record VehicleRequest(String name, String make, String model, String trim, Integer year) {
    }

    public record TrackDay(Long id, Long userId, Long trackId, Long vehicleId,
                           LocalDate startDate, LocalDate endDate, String notes, String conditions) {
        public TrackDay(Long id, Long userId, Long trackId, Long vehicleId,
                        LocalDate startDate, String notes, String conditions) {
            this(id, userId, trackId, vehicleId, startDate, startDate, notes, conditions);
        }
    }

    public record CompletedTrackDay(TrackDay trackDay, List<Session> sessions,
                                    Map<Long, List<Lap>> laps) {
    }

    public record LapRequest(Integer lapNumber, Long timeMillis) {
    }

    public record SessionRequest(String name, String notes, List<LapRequest> laps, LocalDate sessionDate) {
        public SessionRequest(String name, String notes, List<LapRequest> laps) {
            this(name, notes, laps, null);
        }
    }

    public record TrackDayRequest(Long trackId, Long vehicleId, LocalDate startDate,
                                  LocalDate endDate, String notes, String conditions,
                                  List<SessionRequest> sessions) {
    }

    public record SessionDetailsResponse(Session session, List<Lap> laps) {
    }

    public record TrackDayDetailsResponse(TrackDay trackDay, List<Session> sessions) {
    }

    public record DashboardResponse(List<PersonalRecord> personalRecords, int totalTrackDays,
                                    int totalSessions, int totalLaps, long totalLapTimeMillis,
                                    List<TrackDay> recentTrackDays) {
    }

    public record Session(Long id, Long trackDayId, String name, String notes, LocalDate sessionDate) {
        public Session(Long id, Long trackDayId, String name, String notes) {
            this(id, trackDayId, name, notes, null);
        }
    }

    public record Lap(Long id, Long sessionId, Integer lapNumber, Long timeMillis) {
    }

    public record PersonalRecord(Long id, Long userId, Long lapId, Long trackId,
                                 Long vehicleId, Long timeMillis) {
    }

    public record TrackDayStats(Long trackDayId, Long fastestLapTimeMillis, Long averageLapTimeMillis) {
    }
}