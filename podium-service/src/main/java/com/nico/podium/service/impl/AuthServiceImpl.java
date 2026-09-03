package com.nico.podium.service.impl;

import com.nico.podium.domain.PodiumModels.AuthResponse;
import com.nico.podium.domain.PodiumModels.LoginRequest;
import com.nico.podium.domain.PodiumModels.RegisterRequest;
import com.nico.podium.domain.PodiumModels.User;
import com.nico.podium.repository.UserRepository;
import com.nico.podium.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static com.nico.podium.service.impl.ServiceSupportImpl.error;
import static com.nico.podium.service.impl.ServiceSupportImpl.id;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository users;
    private final Map<String, String> tokens = new ConcurrentHashMap<>();

    public AuthServiceImpl(UserRepository users) {
        this.users = users;
    }

    private static String bearer(String value) {
        return value.startsWith("Bearer ") ? value.substring(7) : value;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.email();
        String password = request.password();
        if (email == null || password == null) {
            throw error(HttpStatus.BAD_REQUEST, "email and password are required");
        }
        if (users.findByEmail(email).isPresent()) {
            throw error(HttpStatus.CONFLICT, "email is already registered");
        }
        return response(users.save(new User(null, email, password, request.firstName(), request.lastName())));
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email();
        String password = request.password();
        User user = users.findByEmail(email).filter(candidate -> candidate.password().equals(password)).orElseThrow(() -> error(HttpStatus.UNAUTHORIZED, "invalid credentials"));
        return response(user);
    }

    public AuthResponse refresh(String authorization) {
        User user = currentUser(authorization, null);
        tokens.remove(bearer(authorization));
        return response(user);
    }

    public void logout(String authorization) {
        if (authorization != null) {
            tokens.remove(bearer(authorization));
        }
    }

    public User currentUser(String authorization, String userHeader) {
        String userId = authorization == null ? userHeader : tokens.get(bearer(authorization));
        if (userId == null) {
            throw error(HttpStatus.UNAUTHORIZED, "authentication is required");
        }
        return users.findById(Long.valueOf(userId)).orElseThrow(() -> error(HttpStatus.UNAUTHORIZED, "unknown user"));
    }

    private AuthResponse response(User user) {
        String token = id();
        tokens.put(token, String.valueOf(user.id()));
        return new AuthResponse(user, token);
    }
}