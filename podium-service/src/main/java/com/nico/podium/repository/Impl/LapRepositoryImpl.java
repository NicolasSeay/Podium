package com.nico.podium.repository.Impl;

import com.nico.podium.domain.PodiumModels.Lap;
import com.nico.podium.repository.LapRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class LapRepositoryImpl implements LapRepository {
    private final InMemoryDataStoreImpl store;
    public LapRepositoryImpl(InMemoryDataStoreImpl store) { this.store = store; }
    public Lap save(Lap value) { store.laps.put(value.id(), value); return value; }
    public Optional<Lap> findById(String id) { return Optional.ofNullable(store.laps.get(id)); }
    public List<Lap> findBySessionId(String sessionId) { return store.laps.values().stream().filter(value -> value.sessionId().equals(sessionId)).toList(); }
    public void deleteById(String id) { store.laps.remove(id); }
}