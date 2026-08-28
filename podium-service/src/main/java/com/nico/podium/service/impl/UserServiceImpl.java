package com.nico.podium.service.impl;
import com.nico.podium.domain.PodiumModels.User;
import com.nico.podium.repository.UserRepository;
import com.nico.podium.service.UserService;
import org.springframework.stereotype.Service;
import java.util.Map;
import static com.nico.podium.service.impl.ServiceSupportImpl.*;
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository users;
    public UserServiceImpl(UserRepository users) { this.users = users; }
    public User update(Long userId, Map<String, Object> body) { User current = users.findById(userId).orElseThrow(() -> missing("user")); return users.save(new User(current.id(), current.email(), current.password(), text(body, "firstName", current.firstName()), text(body, "lastName", current.lastName()))); }
}