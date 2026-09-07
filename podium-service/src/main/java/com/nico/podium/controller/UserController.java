package com.nico.podium.controller;

import com.nico.podium.domain.PodiumModels.User;
import com.nico.podium.domain.PodiumModels.UserUpdateRequest;
import com.nico.podium.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController extends ControllerSupport {
    private final UserService users;

    public UserController(UserService users) {
        this.users = users;
    }

    @GetMapping("/{userId}")
    public User get(@PathVariable Long userId) {
        requireCurrentUser(userId);
        return currentUser();
    }

    @PatchMapping("/{userId}")
    public User update(@PathVariable Long userId, @Valid @RequestBody UserUpdateRequest request) {
        return users.update(requireCurrentUser(userId), request);
    }
}