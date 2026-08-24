package com.nico.podium.service.Impl;

import com.nico.podium.domain.PodiumModels.User;
import com.nico.podium.repository.UserRepository;
import com.nico.podium.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import static com.nico.podium.service.Impl.ServiceSupportImpl.*;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository users;
    private final Map<String, String> tokens = new ConcurrentHashMap<>();
    public AuthServiceImpl(UserRepository users) { this.users = users; }
    public Map<String, Object> register(String email, String password, String name) { if (email == null || password == null) throw error(HttpStatus.BAD_REQUEST, "email and password are required"); if (users.findByEmail(email).isPresent()) throw error(HttpStatus.CONFLICT, "email is already registered"); return response(users.save(new User(id(), email, password, name))); }
    public Map<String, Object> login(String email, String password) { User user = users.findByEmail(email).filter(candidate -> candidate.password().equals(password)).orElseThrow(() -> error(HttpStatus.UNAUTHORIZED, "invalid credentials")); return response(user); }
    public Map<String, Object> refresh(String authorization) { User user = currentUser(authorization, null); tokens.remove(bearer(authorization)); return response(user); }
    public void logout(String authorization) { if (authorization != null) tokens.remove(bearer(authorization)); }
    public User currentUser(String authorization, String userHeader) { String userId = authorization == null ? userHeader : tokens.get(bearer(authorization)); if (userId == null) throw error(HttpStatus.UNAUTHORIZED, "authentication is required"); return users.findById(userId).orElseThrow(() -> error(HttpStatus.UNAUTHORIZED, "unknown user")); }
    private Map<String, Object> response(User user) { String token = id(); tokens.put(token, user.id()); return Map.of("user", user, "token", token); }
    private static String bearer(String value) { return value.startsWith("Bearer ") ? value.substring(7) : value; }
}