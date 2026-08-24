package com.nico.podium.repository.Impl;

import com.nico.podium.domain.PodiumModels.*;
import com.nico.podium.repository.TrackRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class TrackRepositoryImpl implements TrackRepository {
    private final InMemoryDataStoreImpl store;
    public TrackRepositoryImpl(InMemoryDataStoreImpl store) { this.store = store; }
    public Track save(Track value) { store.tracks.put(value.id(), value); return value; }
    public Optional<Track> findById(String id) { return Optional.ofNullable(store.tracks.get(id)); }
    public List<Track> findByUserId(String userId) { return store.tracks.values().stream().filter(value -> value.userId().equals(userId)).toList(); }
    public void deleteById(String id) { store.tracks.remove(id); }
    public TrackConfiguration saveConfiguration(TrackConfiguration value) { store.configurations.put(value.id(), value); return value; }
    public List<TrackConfiguration> findConfigurations(String trackId) { return store.configurations.values().stream().filter(value -> value.trackId().equals(trackId)).toList(); }
}