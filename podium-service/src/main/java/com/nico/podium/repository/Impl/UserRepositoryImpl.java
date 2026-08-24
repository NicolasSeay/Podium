package com.nico.podium.repository.Impl;

import com.nico.podium.domain.PodiumModels.User;
import com.nico.podium.repository.UserRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public class UserRepositoryImpl implements UserRepository {
    private final InMemoryDataStoreImpl store;
    public UserRepositoryImpl(InMemoryDataStoreImpl store) { this.store = store; }
    public User save(User user) { store.users.put(user.id(), user); return user; }
    public Optional<User> findById(String id) { return Optional.ofNullable(store.users.get(id)); }
    public Optional<User> findByEmail(String email) { return store.users.values().stream().filter(user -> user.email().equalsIgnoreCase(email)).findFirst(); }
}