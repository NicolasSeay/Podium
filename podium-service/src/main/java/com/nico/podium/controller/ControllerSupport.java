package com.nico.podium.controller;

import com.nico.podium.domain.PodiumModels.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

abstract class ControllerSupport {
    protected Long userId() {
        return currentUser().id();
    }

    protected User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            return user;
        }
        throw new IllegalStateException("authenticated user is required");
    }
}