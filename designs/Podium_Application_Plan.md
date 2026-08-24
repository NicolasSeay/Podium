# TrackLog --- Application Plan

## Core Pages

-   **Dashboard** --- PB, total track days/laps/time, recent events,
    progress chart
-   **Track Days** --- List, filtering, create/edit, track-day detail
-   **Sessions** --- Session summaries, lap entry, notes, conditions
-   **Lap Times / Analytics** --- Progression, averages, consistency,
    distributions, comparisons
-   **Tracks** --- Track/configuration profiles and personal history
-   **Vehicles** --- Cars, performance history, modifications
-   **Records** --- Overall, track, and vehicle personal bests
-   **Goals** --- Lap-time and participation goals with progress
-   **Settings** --- Profile, preferences, units, data management

## Domain Model

``` text
User
├── Vehicle
│   └── Modification
├── Track
│   └── TrackConfiguration
└── TrackDay
    ├── Conditions
    └── Session
        └── Lap

Additional:
- TireSet
- Goal
- PersonalRecord
- Note
```

## Phase 1 --- MVP

1.  Authentication
2.  Dashboard
3.  Track management
4.  Vehicle management
5.  Track-day creation/editing
6.  Session creation
7.  Fast lap-time entry
8.  Automatic personal-best calculation
9.  Lap-time progression chart
10. Track-day history

## Phase 2 --- Analytics

-   Session comparisons
-   Average / median / standard deviation
-   Lap-time distributions
-   Track-specific progression
-   Vehicle-specific progression
-   Personal-records page
-   Goals and progress tracking
-   Track-day / date / vehicle filtering

## Phase 3 --- Advanced Motorsport Data

-   Tire sets and usage tracking
-   Vehicle modifications
-   Weather and track conditions
-   Corner-specific notes
-   Track maps
-   Sector times
-   Telemetry integration
-   CSV / timing-system imports
-   Data export
-   Automated performance insights

## Long-Term Goal

Move beyond CRUD and make the application answer questions such as:

-   **Am I actually getting faster?**
-   **How much have I improved at a specific track?**
-   **Am I becoming more consistent?**
-   **Did a tire or vehicle change correlate with better performance?**
-   **What conditions produce my best laps?**

The key product idea is a **track-day logbook + personal motorsport
analytics platform**.
