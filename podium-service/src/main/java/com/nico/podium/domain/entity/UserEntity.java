package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String password;
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;

    protected UserEntity() {
    }

    public UserEntity(User user) {
        id = user.id();
        email = user.email();
        password = user.password();
        firstName = user.firstName();
        lastName = user.lastName();
    }

    public User toDomain() {
        return new User(id, email, password, firstName, lastName);
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }
}
