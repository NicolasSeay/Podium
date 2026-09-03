# Podium Analytics Recommendations

Podium should help drivers answer three practical questions:

- Am I getting faster?
- Am I becoming more consistent?
- Which track, vehicle, and session context produces my best performance?

The current data model already links track days, sessions, and ordered lap times to tracks and vehicles. That is sufficient for useful pace, consistency, activity, and comparison analytics without introducing telemetry data first.

## Recommended Analytics

### Lap-Time Progression

Show a line chart of each session's fastest lap over time. Optionally include the session average and a rolling median or best-of-N-laps trend to reduce noise.

This is the primary view for answering whether the driver is improving. It should normally be viewed for one track, because raw lap times are not comparable across circuits.

### Session Consistency

For every session, calculate and display:

- Fastest lap
- Average lap
- Median lap
- Standard deviation
- Lap count
- Fastest-to-slowest spread

Use a session range chart: one vertical range per session, with the median marked within it. This gives drivers a more complete view than a single best lap and shows whether fast pace is repeatable.

### In-Session Lap Trace

Plot lap time against lap number for a selected session, with an average or median reference line. This makes warm-up, late-session improvement, traffic, cooldown laps, and possible tire falloff easy to inspect.

### Lap-Time Distribution

Show a histogram for a selected session or set of sessions. Mark the best lap, median, and 90th percentile.

This separates a single unusually quick lap from a session where most laps were quick.

### Track Progression

For a selected track, chart the fastest lap for each track day. Pair the chart with the difference from the track personal best, for example `+1.243 s`.

This should be a core comparison view because repeated visits to the same circuit are the clearest measure of performance progression.

### Vehicle Comparison

When a track is selected, compare best and median lap times by vehicle. Use a dot plot or grouped distribution rather than a single average, and display the number of sessions or track days behind each value.

This can show whether a vehicle change corresponded with faster pace while keeping small sample sizes visible.

### Activity and Seat Time

Show monthly bars for track days, sessions, total laps, and total driving time. Display this alongside pace trends so performance can be interpreted in the context of practice volume.

### Personal-Record Timeline

Show every new personal best with its date, track, vehicle, lap time, and improvement versus the prior record. This provides a useful milestone view beyond a static records table.

## Recommended Filters

Apply these filters consistently throughout Analytics:

- Date range: Last 30 days, Last 6 months, This year, All time, and a custom range.
- Track: All tracks or a selected circuit. Favor a single-track selection for pace comparison.
- Vehicle: Include an explicit `No vehicle recorded` option because vehicle is optional for a track day.
- Track day: Allow close investigation of a particular event.
- Session: Required for lap traces and distributions.
- Conditions: Initially support text search or tags based on recorded condition values.
- Minimum lap count: Exclude small samples, such as sessions with fewer than three or five laps.
- Outlier handling: Let drivers exclude laps beyond a configurable threshold from the session median so cooldown, red-flag, or traffic laps do not distort summaries.

## First Analytics Screen

Build the first Analytics screen around a shared filter bar and four visualizations:

1. Fastest lap by date for the selected track.
2. Consistency by session, showing fastest lap, median, average, standard deviation, and lap count.
3. Lap time by lap number for the selected session.
4. Lap-time distribution for the selected session or comparison set.

Below the charts, provide a drill-down table with track day, date, vehicle, session, laps, best lap, median, average, standard deviation, and delta to personal best. Selecting a row should update the session-level charts.

## Current Data Support

The following data is already available and can support the initial analytics scope:

- Track day: track, optional vehicle, start and end dates, notes, and conditions.
- Session: track-day relationship, name, notes, and optional session date.
- Lap: session relationship, lap number, and lap time in milliseconds.
- Track: name, location, and length.
- Personal record: track, vehicle, lap, and lap time.

The dashboard and track-day endpoints already support track and vehicle filtering, and the track-day endpoint additionally supports date filtering.

## Structured Data Needed Later

The current conditions field is free text. It supports display, search, and lightweight tagging, but it is not reliable enough for quantitative comparisons. To support questions such as "What conditions produce my best laps?", capture structured values for:

- Air temperature, track temperature, precipitation, and wet/dry state.
- Tire set, compound, heat cycles, and pressure.
- Vehicle configuration, modifications, fuel/load, and setup changes.
- Track configuration or layout.
- Session context, such as traffic, red flags, and session type.
- Sector times and telemetry data.

These additions should be introduced after the core pace and consistency views. The first analytics release should prioritize clear comparisons from the data Podium already records.

## Initial Dashboard Delivery

The dashboard now delivers the first analytics screen using the existing track, vehicle, session, and lap data. In addition to the aggregate dashboard metrics, the dashboard response includes `analyticsSessions`. Each entry contains the session, track-day date, vehicle, and ordered laps. The frontend derives fastest lap, average, median, standard deviation, and spread from those laps.

The delivered view includes fastest-lap progression, session consistency ranges, a selectable in-session lap trace, a five-bucket lap-time distribution, and a session detail table. Selecting a consistency column or table row updates the session-level charts. Structured weather, tire, setup, outlier, and date-range filters remain future work because those fields are not yet normalized or exposed by the current API.