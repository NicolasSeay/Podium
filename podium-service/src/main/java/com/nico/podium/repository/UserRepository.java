package com.nico.podium.repository;

import com.nico.podium.domain.PodiumModels.User;

import java.util.Optional;

public interface UserRepository {
    User save(User user);

    Optional<User> findById(Long id);

    Optional<User> findByEmail(String email);
}