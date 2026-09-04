package com.nico.podium.service.impl;

import com.nico.podium.domain.PodiumModels.AuthResponse;
import com.nico.podium.domain.PodiumModels.LoginRequest;
import com.nico.podium.domain.PodiumModels.RegisterRequest;
import com.nico.podium.domain.PodiumModels.User;
import com.nico.podium.domain.entity.AuthTokenEntity;
import com.nico.podium.repository.UserRepository;
import com.nico.podium.repository.jpa.AuthTokenJpaRepository;
import com.nico.podium.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;

import static com.nico.podium.service.impl.ServiceSupportImpl.error;
import static com.nico.podium.service.impl.ServiceSupportImpl.id;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository users;
    private final AuthTokenJpaRepository tokens;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();
    private final Duration tokenLifetime = Duration.ofHours(1);

    public AuthServiceImpl(UserRepository users, AuthTokenJpaRepository tokens, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.tokens = tokens;
        this.passwordEncoder = passwordEncoder;
    }

    private static String bearer(String value) {
        if (value == null || !value.regionMatches(true, 0, "Bearer ", 0, 7)) {
            throw error(HttpStatus.UNAUTHORIZED, "a bearer token is required");
        }
        String token = value.substring(7).trim();
        if (token.isEmpty()) {
            throw error(HttpStatus.UNAUTHORIZED, "a bearer token is required");
        }
        return token;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.email();
        String password = request.password();
        if (email == null || password == null || email.isBlank() || password.length() < 12) {
            throw error(HttpStatus.BAD_REQUEST, "email and password are required");
        }
        email = email.trim();
        if (users.findByEmail(email).isPresent()) {
            throw error(HttpStatus.BAD_REQUEST, "registration failed");
        }
        return response(users.save(new User(null, email, passwordEncoder.encode(password), request.firstName(), request.lastName())));
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email();
        String password = request.password();
        User user = users.findByEmail(email)
            .filter(candidate -> password != null && passwordEncoder.matches(password, candidate.password()))
            .orElseThrow(() -> error(HttpStatus.UNAUTHORIZED, "invalid credentials"));
        return response(user);
    }

    public AuthResponse refresh(String authorization) {
        User user = currentUser(authorization, null);
        revoke(authorization);
        return response(user);
    }

    public void logout(String authorization) {
        if (authorization != null) {
            revoke(authorization);
        }
    }

    public User currentUser(String authorization, String userHeader) {
        AuthTokenEntity token = tokens.findByTokenHashAndRevokedAtIsNull(hash(bearer(authorization)))
            .filter(candidate -> candidate.getExpiresAt().isAfter(Instant.now()))
            .orElseThrow(() -> error(HttpStatus.UNAUTHORIZED, "invalid or expired token"));
        return users.findById(token.getUserId()).orElseThrow(() -> error(HttpStatus.UNAUTHORIZED, "unknown user"));
    }

    private AuthResponse response(User user) {
        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
        tokens.save(new AuthTokenEntity(hash(token), user.id(), Instant.now().plus(tokenLifetime)));
        return new AuthResponse(user, token);
    }

    private void revoke(String authorization) {
        String tokenValue = bearer(authorization);
        tokens.findByTokenHashAndRevokedAtIsNull(hash(tokenValue)).ifPresent(token -> {
            token.revoke();
            tokens.save(token);
        });
    }

    private static String hash(String token) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }
}