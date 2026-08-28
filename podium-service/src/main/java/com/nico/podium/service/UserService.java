package com.nico.podium.service;

import com.nico.podium.domain.PodiumModels.User;

import java.util.Map;

public interface UserService {
    User update(Long userId, Map<String, Object> body);
}