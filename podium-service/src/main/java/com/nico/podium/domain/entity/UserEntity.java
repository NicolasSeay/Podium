package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    private String id;
    private String email;
    private String password;
    private String name;

    protected UserEntity() {
    }

    public UserEntity(User user) {
        id = user.id();
        email = user.email();
        password = user.password();
        name = user.name();
    }

    public User toDomain() {
        return new User(id, email, password, name);
    }

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }
}
