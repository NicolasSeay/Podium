package com.nico.podium.domain.entity;

import com.nico.podium.domain.PodiumModels.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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

}
