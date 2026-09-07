package com.nico.podium.controller;

import com.nico.podium.domain.PodiumModels.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

abstract class ControllerSupport {
    protected Long userId() {
        return currentUser().id();
    }

    protected Long requireCurrentUser(Long requestedUserId) {
        if (!currentUser().id().equals(requestedUserId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
        }
        return requestedUserId;
    }

    protected User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            return user;
        }
        throw new IllegalStateException("authenticated user is required");
    }
}