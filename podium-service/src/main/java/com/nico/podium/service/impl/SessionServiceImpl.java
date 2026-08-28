package com.nico.podium.service.impl;
 import com.nico.podium.domain.PodiumModels.Session; import com.nico.podium.repository.SessionRepository; import com.nico.podium.service.SessionService; import com.nico.podium.service.TrackDayService; import org.springframework.stereotype.Service; import java.util.List; import java.util.Map; import static com.nico.podium.service.impl.ServiceSupportImpl.*;
@Service public class SessionServiceImpl implements SessionService {
 private final SessionRepository sessions; private final TrackDayService days;
 public SessionServiceImpl(SessionRepository sessions,TrackDayService days){this.sessions=sessions;this.days=days;}
 public List<Session> list(Long userId,Long trackDayId){days.get(userId,trackDayId);return sessions.findByTrackDayId(trackDayId);} public Session get(Long userId,Long id){Session s=sessions.findById(id).orElseThrow(()->missing("session"));days.get(userId,s.trackDayId());return s;}
 public Session create(Long userId,Long trackDayId,Map<String,Object>b){days.get(userId,trackDayId);return sessions.save(new Session(null,trackDayId,text(b,"name","Session"),text(b,"notes",null)));}
 public Session update(Long userId,Long id,Map<String,Object>b){Session c=get(userId,id);return sessions.save(new Session(c.id(),c.trackDayId(),text(b,"name",c.name()),text(b,"notes",c.notes())));} public void delete(Long userId,Long id){get(userId,id);sessions.deleteById(id);}
}