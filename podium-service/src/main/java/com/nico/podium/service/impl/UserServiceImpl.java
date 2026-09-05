package com.nico.podium.service.impl;

import com.nico.podium.domain.PodiumModels.User;
import com.nico.podium.domain.PodiumModels.UserUpdateRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import com.nico.podium.repository.UserRepository;
import com.nico.podium.service.UserService;
import org.springframework.stereotype.Service;

import static com.nico.podium.service.impl.ServiceSupportImpl.missing;
import static com.nico.podium.service.impl.ServiceSupportImpl.error;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository users;

    public UserServiceImpl(UserRepository users) {
        this.users = users;
    }

    public User update(Long userId, UserUpdateRequest request) {
        User current = users.findById(userId).orElseThrow(() -> missing("user"));
        String email = request.email() == null ? current.email() : request.email().trim();
        if (!email.equalsIgnoreCase(current.email()) && !emailAvailable(userId, email)) {
            throw error(HttpStatus.CONFLICT, "email is already in use");
        }
        User updated = new User(current.id(), email,
                current.password(),
                request.firstName() == null ? current.firstName() : request.firstName().trim(),
                request.lastName() == null ? current.lastName() : request.lastName().trim(),
                request.distanceUnit() == null ? current.distanceUnit() : request.distanceUnit(),
                request.temperatureUnit() == null ? current.temperatureUnit() : request.temperatureUnit(),
                request.defaultTrackId() == null ? current.defaultTrackId() : request.defaultTrackId(),
                request.defaultVehicleId() == null ? current.defaultVehicleId() : request.defaultVehicleId());
        try {
            return users.save(updated);
        } catch (DataIntegrityViolationException exception) {
            throw error(HttpStatus.CONFLICT, "email is already in use");
        }
    }

    public boolean emailAvailable(Long userId, String email) {
        User current = users.findById(userId).orElseThrow(() -> missing("user"));
        return email != null && !email.isBlank()
                && (email.equalsIgnoreCase(current.email()) || !users.existsByEmail(email.trim()));
    }
}