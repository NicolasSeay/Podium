package com.nico.podium.service;

import com.nico.podium.domain.PodiumModels.User;
import com.nico.podium.domain.PodiumModels.UserUpdateRequest;


public interface UserService {
    User update(Long userId, UserUpdateRequest request);
}