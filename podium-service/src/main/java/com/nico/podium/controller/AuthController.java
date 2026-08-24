package com.nico.podium.controller;

import com.nico.podium.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    private static String text(Map<String, Object> b, String k) {
        Object v = b.get(k);
        return v == null ? null : String.valueOf(v);
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, Object> b) {
        return auth.register(text(b, "email"), text(b, "password"), text(b, "name"));
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, Object> b) {
        return auth.login(text(b, "email"), text(b, "password"));
    }

    @PostMapping("/refresh")
    public Map<String, Object> refresh(@RequestHeader("Authorization") String header) {
        return auth.refresh(header);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@RequestHeader(value = "Authorization", required = false) String header) {
        auth.logout(header);
    }
}