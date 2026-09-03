package com.nico.podium.service.impl;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

public final class ServiceSupportImpl {
    private ServiceSupportImpl() {
    }

    public static String id() {
        return UUID.randomUUID().toString();
    }

    public static ResponseStatusException missing(String type) {
        return error(HttpStatus.NOT_FOUND, type + " not found");
    }

    public static ResponseStatusException error(HttpStatus status, String message) {
        return new ResponseStatusException(status, message);
    }
}