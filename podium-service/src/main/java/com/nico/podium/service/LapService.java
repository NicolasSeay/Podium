package com.nico.podium.service;
import com.nico.podium.domain.PodiumModels.Lap; import java.util.List; import java.util.Map;
public interface LapService { List<Lap> list(Long userId,Long sessionId); Lap get(Long userId,Long id); Lap create(Long userId,Long sessionId,Map<String,Object> body); Lap update(Long userId,Long id,Map<String,Object> body); void delete(Long userId,Long id); }