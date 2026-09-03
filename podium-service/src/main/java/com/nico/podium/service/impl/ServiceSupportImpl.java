package com.nico.podium.service.impl;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

public final class ServiceSupportImpl {
    private ServiceSupportImpl() { }
    public static String id() { return UUID.randomUUID().toString(); }
    public static String required(Map<String, Object> body, String key) { String value = text(body, key, null); if (value == null || value.isBlank()) throw error(HttpStatus.BAD_REQUEST, key + " is required"); return value; }
    public static Long numberRequired(Map<String, Object> body, String key) { Long value = number(body, key); if (value == null) throw error(HttpStatus.BAD_REQUEST, key + " is required"); return value; }
    public static String text(Map<String, Object> body, String key, String fallback) { Object value = body.get(key); return value == null ? fallback : String.valueOf(value); }
    public static Integer integer(Map<String, Object> body, String key, Integer fallback) { Object value = body.get(key); return value == null ? fallback : Integer.valueOf(String.valueOf(value)); }
    public static BigDecimal decimal(Map<String, Object> body, String key, BigDecimal fallback) { Object value = body.get(key); return value == null ? fallback : new BigDecimal(String.valueOf(value)); }
    public static Long number(Map<String, Object> body, String key) { Object value = body.get(key); return value == null ? null : Long.valueOf(String.valueOf(value)); }
    public static LocalDate date(Map<String, Object> body, String key, LocalDate fallback) { String value = text(body, key, null); return value == null ? fallback : LocalDate.parse(value); }
    public static ResponseStatusException missing(String type) { return error(HttpStatus.NOT_FOUND, type + " not found"); }
    public static ResponseStatusException error(HttpStatus status, String message) { return new ResponseStatusException(status, message); }
}