package com.nico.podium.controller;

import com.nico.podium.domain.PodiumModels.User;
import com.nico.podium.service.AuthService;
import com.nico.podium.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController extends ControllerSupport {
    private final UserService users;

    public UserController(AuthService auth, UserService users) {
        super(auth);
        this.users = users;
    }

    @GetMapping("/me")
    public User me(@RequestHeader(value = "Authorization", required = false) String a, @RequestHeader(value = "X-User-Id", required = false) String h) {
        return auth.currentUser(a, h);
    }

    @PatchMapping("/me")
    public User update(@RequestHeader(value = "Authorization", required = false) String a, @RequestHeader(value = "X-User-Id", required = false) String h, @RequestBody Map<String, Object> b) {
        return users.update(userId(a, h), b);
    }
}