package com.nico.podium.controller;

import com.nico.podium.domain.PodiumModels.PersonalRecord;
import com.nico.podium.service.PersonalRecordService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/records")
public class RecordController extends ControllerSupport {
    private final PersonalRecordService records;

    public RecordController(PersonalRecordService records) {
        this.records = records;
    }

    @GetMapping
    public List<PersonalRecord> list() {
        return records.list(userId());
    }
}