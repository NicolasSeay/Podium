package com.nico.podium.repository.Impl;

import com.nico.podium.domain.PodiumModels.Session;
import com.nico.podium.repository.SessionRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class SessionRepositoryImpl implements SessionRepository {
    private final InMemoryDataStoreImpl store;
    public SessionRepositoryImpl(InMemoryDataStoreImpl store) { this.store = store; }
    public Session save(Session value) { store.sessions.put(value.id(), value); return value; }
    public Optional<Session> findById(String id) { return Optional.ofNullable(store.sessions.get(id)); }
    public List<Session> findByTrackDayId(String trackDayId) { return store.sessions.values().stream().filter(value -> value.trackDayId().equals(trackDayId)).toList(); }
    public void deleteById(String id) { store.sessions.remove(id); }
}