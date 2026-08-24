package com.nico.podium.service;
import com.nico.podium.domain.PodiumModels.PersonalRecord; import java.util.List;
public interface PersonalRecordService { List<PersonalRecord> list(String userId); void refresh(String userId,String lapId,String sessionId,long timeMillis); }