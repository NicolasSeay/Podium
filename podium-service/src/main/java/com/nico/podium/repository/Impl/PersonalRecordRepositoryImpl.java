package com.nico.podium.repository.Impl;

import com.nico.podium.domain.PodiumModels.PersonalRecord;
import com.nico.podium.repository.PersonalRecordRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class PersonalRecordRepositoryImpl implements PersonalRecordRepository {
    private final InMemoryDataStoreImpl store;
    public PersonalRecordRepositoryImpl(InMemoryDataStoreImpl store) { this.store = store; }
    public PersonalRecord save(PersonalRecord value) { store.records.put(value.id(), value); return value; }
    public List<PersonalRecord> findByUserId(String userId) { return store.records.values().stream().filter(value -> value.userId().equals(userId)).toList(); }
}