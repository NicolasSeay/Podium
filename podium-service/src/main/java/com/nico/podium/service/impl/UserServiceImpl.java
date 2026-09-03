package com.nico.podium.service.impl;

import com.nico.podium.domain.PodiumModels.User;
import com.nico.podium.domain.PodiumModels.UserUpdateRequest;
import com.nico.podium.repository.UserRepository;
import com.nico.podium.service.UserService;
import org.springframework.stereotype.Service;

import static com.nico.podium.service.impl.ServiceSupportImpl.missing;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository users;

    public UserServiceImpl(UserRepository users) {
        this.users = users;
    }

    public User update(Long userId, UserUpdateRequest request) {
        User current = users.findById(userId).orElseThrow(() -> missing("user"));
        return users.save(new User(current.id(), current.email(), current.password(), request.firstName() == null ? current.firstName() : request.firstName(), request.lastName() == null ? current.lastName() : request.lastName()));
    }
}