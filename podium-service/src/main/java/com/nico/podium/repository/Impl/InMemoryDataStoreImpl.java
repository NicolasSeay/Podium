package com.nico.podium.repository.Impl;

import com.nico.podium.domain.PodiumModels.*;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Component
public class InMemoryDataStoreImpl {
    final ConcurrentMap<String, User> users = new ConcurrentHashMap<>();
    final ConcurrentMap<String, Track> tracks = new ConcurrentHashMap<>();
    final ConcurrentMap<String, TrackConfiguration> configurations = new ConcurrentHashMap<>();
    final ConcurrentMap<String, Vehicle> vehicles = new ConcurrentHashMap<>();
    final ConcurrentMap<String, TrackDay> trackDays = new ConcurrentHashMap<>();
    final ConcurrentMap<String, Session> sessions = new ConcurrentHashMap<>();
    final ConcurrentMap<String, Lap> laps = new ConcurrentHashMap<>();
    final ConcurrentMap<String, PersonalRecord> records = new ConcurrentHashMap<>();
}