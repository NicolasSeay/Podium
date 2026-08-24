package com.nico.podium.controller;

import com.nico.podium.service.AuthService;

abstract class ControllerSupport {
    protected final AuthService auth;

    protected ControllerSupport(AuthService auth) {
        this.auth = auth;
    }

    protected String userId(String authorization, String header) {
        return auth.currentUser(authorization, header).id();
    }
}