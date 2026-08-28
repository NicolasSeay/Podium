package com.nico.podium.service;

import com.nico.podium.domain.PodiumModels.User;

import java.util.Map;

public interface AuthService {
    Map<String, Object> register(String email, String password, String firstName, String lastName);

    Map<String, Object> login(String email, String password);

    Map<String, Object> refresh(String authorization);

    void logout(String authorization);

    User currentUser(String authorization, String userHeader);
}