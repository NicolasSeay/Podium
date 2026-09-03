CREATE DATABASE IF NOT EXISTS podium
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE podium;

CREATE TABLE IF NOT EXISTS users (
    id         BIGINT NOT NULL AUTO_INCREMENT,
    email      VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name  VARCHAR(255),
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS tracks (
    id           BIGINT NOT NULL AUTO_INCREMENT,
    name         VARCHAR(255) NOT NULL,
    city         VARCHAR(255),
    country      VARCHAR(255),
    length_miles DECIMAL(7,3),
    PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS track_configurations (
    id            BIGINT NOT NULL AUTO_INCREMENT,
    track_id      BIGINT NOT NULL,
    name          VARCHAR(255),
    length_meters INT,
    PRIMARY KEY (id),
    KEY idx_track_configurations_track_id (track_id),
    CONSTRAINT fk_track_configurations_track
        FOREIGN KEY (track_id) REFERENCES tracks (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS vehicles (
    id           BIGINT NOT NULL AUTO_INCREMENT,
    user_id      BIGINT NOT NULL,
    name         VARCHAR(255),
    make         VARCHAR(255),
    model        VARCHAR(255),
    vehicle_year INT,
    PRIMARY KEY (id),
    KEY idx_vehicles_user_id (user_id),
    CONSTRAINT fk_vehicles_user
        FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS track_days (
    id         BIGINT NOT NULL AUTO_INCREMENT,
    user_id    BIGINT NOT NULL,
    track_id   BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    date       DATE,
    notes      VARCHAR(255),
    conditions VARCHAR(255),
    PRIMARY KEY (id),
    KEY idx_track_days_user_id (user_id),
    KEY idx_track_days_track_id (track_id),
    KEY idx_track_days_vehicle_id (vehicle_id),
    CONSTRAINT fk_track_days_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_track_days_track
        FOREIGN KEY (track_id) REFERENCES tracks (id),
    CONSTRAINT fk_track_days_vehicle
        FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS sessions (
    id          BIGINT NOT NULL AUTO_INCREMENT,
    track_day_id BIGINT NOT NULL,
    name        VARCHAR(255),
    notes       VARCHAR(255),
    PRIMARY KEY (id),
    KEY idx_sessions_track_day_id (track_day_id),
    CONSTRAINT fk_sessions_track_day
        FOREIGN KEY (track_day_id) REFERENCES track_days (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS laps (
    id         BIGINT NOT NULL AUTO_INCREMENT,
    session_id BIGINT NOT NULL,
    lap_number INT,
    time_millis BIGINT,
    PRIMARY KEY (id),
    KEY idx_laps_session_id (session_id),
    CONSTRAINT fk_laps_session
        FOREIGN KEY (session_id) REFERENCES sessions (id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS personal_records (
    id         BIGINT NOT NULL AUTO_INCREMENT,
    user_id    BIGINT NOT NULL,
    lap_id     BIGINT NOT NULL,
    track_id   BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    time_millis BIGINT,
    PRIMARY KEY (id),
    KEY idx_personal_records_user_id (user_id),
    KEY idx_personal_records_lap_id (lap_id),
    KEY idx_personal_records_track_id (track_id),
    KEY idx_personal_records_vehicle_id (vehicle_id),
    CONSTRAINT fk_personal_records_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_personal_records_lap
        FOREIGN KEY (lap_id) REFERENCES laps (id),
    CONSTRAINT fk_personal_records_track
        FOREIGN KEY (track_id) REFERENCES tracks (id),
    CONSTRAINT fk_personal_records_vehicle
        FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
) ENGINE = InnoDB;
