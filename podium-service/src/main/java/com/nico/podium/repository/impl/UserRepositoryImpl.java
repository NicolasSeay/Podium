package com.nico.podium.repository.impl;

import com.nico.podium.domain.PodiumModels.User;
import com.nico.podium.domain.entity.UserEntity;
import com.nico.podium.repository.UserRepository;
import com.nico.podium.repository.jpa.UserJpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserRepositoryImpl implements UserRepository {
    private final UserJpaRepository repository;

    public UserRepositoryImpl(UserJpaRepository repository) {
        this.repository = repository;
    }

    public User save(User user) {
        return repository.save(new UserEntity(user)).toDomain();
    }

    public Optional<User> findById(Long id) {
        return repository.findById(id).map(UserEntity::toDomain);
    }

    public Optional<User> findByEmail(String email) {
        return repository.findByEmailIgnoreCase(email).map(UserEntity::toDomain);
    }

    public boolean existsByEmail(String email) {
        return repository.existsByEmailIgnoreCase(email);
    }
}