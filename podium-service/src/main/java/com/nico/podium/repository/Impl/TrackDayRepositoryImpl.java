package com.nico.podium.repository.Impl;

import com.nico.podium.domain.PodiumModels.TrackDay;
import com.nico.podium.repository.TrackDayRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class TrackDayRepositoryImpl implements TrackDayRepository {
    private final InMemoryDataStoreImpl store;
    public TrackDayRepositoryImpl(InMemoryDataStoreImpl store) { this.store = store; }
    public TrackDay save(TrackDay value) { store.trackDays.put(value.id(), value); return value; }
    public Optional<TrackDay> findById(String id) { return Optional.ofNullable(store.trackDays.get(id)); }
    public List<TrackDay> findByUserId(String userId) { return store.trackDays.values().stream().filter(value -> value.userId().equals(userId)).toList(); }
    public void deleteById(String id) { store.trackDays.remove(id); }
}