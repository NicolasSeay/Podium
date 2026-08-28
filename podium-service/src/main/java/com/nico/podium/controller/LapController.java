package com.nico.podium.controller;
import com.nico.podium.domain.PodiumModels.Lap; import com.nico.podium.service.*; import org.springframework.http.HttpStatus; import org.springframework.web.bind.annotation.*; import java.util.Map;
@RestController @RequestMapping("/api/laps") public class LapController extends ControllerSupport {
 private final LapService laps; public LapController(AuthService auth,LapService laps){super(auth);this.laps=laps;}
 @PatchMapping("/{id}") public Lap update(@PathVariable Long id,@RequestHeader(value="Authorization",required=false)String a,@RequestHeader(value="X-User-Id",required=false)String h,@RequestBody Map<String,Object>b){return laps.update(userId(a,h),id,b);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id,@RequestHeader(value="Authorization",required=false)String a,@RequestHeader(value="X-User-Id",required=false)String h){laps.delete(userId(a,h),id);}
}