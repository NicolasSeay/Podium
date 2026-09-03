package com.nico.podium.service.impl;
import com.nico.podium.domain.PodiumModels.*; import com.nico.podium.repository.*; import com.nico.podium.service.DashboardService; import com.nico.podium.service.PersonalRecordService; import org.springframework.stereotype.Service; import java.util.*;
@Service public class DashboardServiceImpl implements DashboardService {
 private final TrackDayRepository days; private final SessionRepository sessions; private final LapRepository laps; private final PersonalRecordService records;
 public DashboardServiceImpl(TrackDayRepository days,SessionRepository sessions,LapRepository laps,PersonalRecordService records){this.days=days;this.sessions=sessions;this.laps=laps;this.records=records;}
 public Map<String,Object> get(Long userId, Long trackId, Long vehicleId){
  List<TrackDay>d=days.findByUserId(userId).stream().filter(day->trackId==null||trackId.equals(day.trackId())).filter(day->vehicleId==null||vehicleId.equals(day.vehicleId())).toList();
  List<Session>s=d.stream().flatMap(day->sessions.findByTrackDayId(day.id()).stream()).toList();
  List<Lap>l=s.stream().flatMap(session->laps.findBySessionId(session.id()).stream()).toList();
  List<PersonalRecord> filteredRecords=records.list(userId).stream().filter(record->trackId==null||trackId.equals(record.trackId())).filter(record->vehicleId==null||vehicleId.equals(record.vehicleId())).toList();
  return Map.of("personalRecords",filteredRecords,"totalTrackDays",d.size(),"totalSessions",s.size(),"totalLaps",l.size(),"totalLapTimeMillis",l.stream().mapToLong(Lap::timeMillis).sum(),"recentTrackDays",d.stream().sorted(Comparator.comparing(TrackDay::startDate).reversed()).limit(5).toList());
 }
}