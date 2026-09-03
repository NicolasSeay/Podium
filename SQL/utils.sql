-- Podium database utilities.
-- Run one section at a time as needed.

-- Permanently remove all application tables while preserving the database.
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS
    personal_records,
    laps,
    sessions,
    track_days,
    vehicles,
    tracks,
    users;
SET FOREIGN_KEY_CHECKS = 1;

-- Remove all application data and reset auto-increment values.
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE personal_records;
TRUNCATE TABLE laps;
TRUNCATE TABLE sessions;
TRUNCATE TABLE track_days;
TRUNCATE TABLE vehicles;
TRUNCATE TABLE tracks;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Show tables, approximate row counts, and storage.
SELECT
    table_name,
    table_rows AS approximate_row_count,
    ROUND((data_length + index_length) / 1024, 1) AS size_kb
FROM information_schema.tables
WHERE table_schema = DATABASE()
ORDER BY table_name;
