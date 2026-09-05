package com.nico.podium.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public final class PodiumModels {

    private PodiumModels() {
    }

    public record User(Long id, String email, @JsonIgnore String password, String firstName, String lastName) {
    }

        public record RegisterRequest(
            @NotBlank @Email @Size(max = 254) String email,
            @NotBlank @Size(min = 8, max = 128) String password,
            @NotBlank @Size(max = 100) String firstName,
            @NotBlank @Size(max = 100) String lastName) {
    }

        public record LoginRequest(@NotBlank @Email @Size(max = 254) String email,
                       @NotBlank String password) {
    }

    public record AuthResponse(User user, String token) {
    }

    public record UserUpdateRequest(@Size(max = 100) String firstName, @Size(max = 100) String lastName) {
    }

    public record Track(Long id, String name, String city, String country, BigDecimal lengthMiles) {
    }

    public record TrackRequest(@Size(max = 200) String name, @Size(max = 100) String city,
                               @Size(max = 100) String country, @Positive BigDecimal lengthMiles) {
    }

    public record Vehicle(Long id, Long userId, String name, String make, String model, String trim, Integer year) {
    }

    public record VehicleRequest(@Size(max = 100) String name, @Size(max = 100) String make,
                                 @Size(max = 100) String model, @Size(max = 100) String trim,
                                 @Min(1886) @Max(2100) Integer year) {
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

    public record LapRequest(@Positive Integer lapNumber, @Positive Long timeMillis) {
    }

    public record SessionRequest(@Size(max = 100) String name, @Size(max = 2000) String notes,
                                 List<@Valid LapRequest> laps, LocalDate sessionDate) {
        public SessionRequest(String name, String notes, List<LapRequest> laps) {
            this(name, notes, laps, null);
        }
    }

    public record TrackDayRequest(@Positive Long trackId, @NotNull @Positive Long vehicleId, LocalDate startDate,
                                  LocalDate endDate, String notes, String conditions,
                                  List<@Valid SessionRequest> sessions) {
    }

    public record SessionDetailsResponse(Session session, List<Lap> laps) {
    }

    public record TrackDayDetailsResponse(TrackDay trackDay, List<Session> sessions) {
    }

    public record DashboardResponse(List<PersonalRecord> personalRecords, int totalTrackDays,
                                    int totalSessions, int totalLaps, long totalLapTimeMillis,
                                    List<TrackDay> recentTrackDays,
                                    List<DashboardSession> analyticsSessions) {
    }

    public record DashboardSession(Long sessionId, Long trackDayId, LocalDate trackDayDate,
                                   Long vehicleId, String sessionName, List<Lap> laps) {
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