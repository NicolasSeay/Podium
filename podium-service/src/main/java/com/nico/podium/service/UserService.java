package com.nico.podium.service;

import com.nico.podium.domain.PodiumModels.User;

import java.util.Map;

public interface UserService {
    User update(String userId, Map<String, Object> body);
}