USE podium;

ALTER TABLE users
    ADD COLUMN distance_unit ENUM('MILES', 'KILOMETERS') NOT NULL DEFAULT 'MILES',
    ADD COLUMN temperature_unit ENUM('FAHRENHEIT', 'CELSIUS') NOT NULL DEFAULT 'FAHRENHEIT',
    ADD COLUMN default_track_id BIGINT,
    ADD COLUMN default_vehicle_id BIGINT;