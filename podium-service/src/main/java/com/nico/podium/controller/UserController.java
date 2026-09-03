package com.nico.podium.controller;

import com.nico.podium.domain.PodiumModels.User;
import com.nico.podium.domain.PodiumModels.UserUpdateRequest;
import com.nico.podium.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController extends ControllerSupport {
    private final UserService users;

    public UserController(UserService users) {
        this.users = users;
    }

    @GetMapping("/me")
    public User me() {
        return currentUser();
    }

    @PatchMapping("/me")
    public User update(@RequestBody UserUpdateRequest request) {
        return users.update(userId(), request);
    }
}