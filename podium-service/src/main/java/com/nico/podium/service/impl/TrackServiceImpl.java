package com.nico.podium.service.impl;
 import com.nico.podium.domain.PodiumModels.*; import com.nico.podium.repository.TrackRepository; import com.nico.podium.service.TrackService; import org.springframework.stereotype.Service; import java.math.BigDecimal; import java.util.List; import java.util.Map; import static com.nico.podium.service.impl.ServiceSupportImpl.*;
@Service public class TrackServiceImpl implements TrackService {
    private final TrackRepository tracks; public TrackServiceImpl(TrackRepository tracks) { this.tracks = tracks; }
     public List<Track> list(Long userId) { return tracks.findAll(); }
     public Track get(Long userId,Long id) { return tracks.findById(id).orElseThrow(()->missing("track")); }
     public Track create(Long userId,Map<String,Object> body) { return tracks.save(new Track(null,required(body,"name"),text(body,"city",null),text(body,"country",null),decimal(body,"lengthMiles",null))); }
     public Track update(Long userId,Long id,Map<String,Object> body) { Track c=get(userId,id); return tracks.save(new Track(c.id(),text(body,"name",c.name()),text(body,"city",c.city()),text(body,"country",c.country()),decimal(body,"lengthMiles",c.lengthMiles()))); }
    public void delete(Long userId,Long id) { get(userId,id); tracks.deleteById(id); }
    public List<TrackConfiguration> configurations(Long userId,Long trackId) { get(userId,trackId); return tracks.findConfigurations(trackId); }
    public TrackConfiguration createConfiguration(Long userId,Long trackId,Map<String,Object> body) { get(userId,trackId); return tracks.saveConfiguration(new TrackConfiguration(null,trackId,required(body,"name"),integer(body,"lengthMeters",null))); }
}