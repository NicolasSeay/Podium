package com.nico.podium.controller;
import com.nico.podium.domain.PodiumModels.PersonalRecord; import com.nico.podium.service.*; import org.springframework.web.bind.annotation.*; import java.util.List;
@RestController @RequestMapping("/api/records") public class RecordController extends ControllerSupport {
 private final PersonalRecordService records; public RecordController(AuthService auth,PersonalRecordService records){super(auth);this.records=records;}
 @GetMapping public List<PersonalRecord> list(@RequestHeader(value="Authorization",required=false)String a,@RequestHeader(value="X-User-Id",required=false)String h){return records.list(userId(a,h));}
}