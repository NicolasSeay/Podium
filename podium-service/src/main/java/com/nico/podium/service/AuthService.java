package com.nico.podium.service;

import com.nico.podium.domain.PodiumModels.AuthResponse;
import com.nico.podium.domain.PodiumModels.LoginRequest;
import com.nico.podium.domain.PodiumModels.RegisterRequest;
import com.nico.podium.domain.PodiumModels.User;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refresh(String authorization);

    void logout(String authorization);

    User currentUser(String authorization, String userHeader);
}