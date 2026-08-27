package com.nico.podium.service.impl;
 import com.nico.podium.domain.PodiumModels.Vehicle; import com.nico.podium.repository.VehicleRepository; import com.nico.podium.service.VehicleService; import org.springframework.stereotype.Service; import java.util.List; import java.util.Map; import static com.nico.podium.service.impl.ServiceSupportImpl.*;
@Service public class VehicleServiceImpl implements VehicleService {
 private final VehicleRepository vehicles; public VehicleServiceImpl(VehicleRepository vehicles){this.vehicles=vehicles;}
 public List<Vehicle> list(String userId){return vehicles.findByUserId(userId);} public Vehicle get(String userId,String id){Vehicle v=vehicles.findById(id).orElseThrow(()->missing("vehicle"));if(!v.userId().equals(userId))throw missing("vehicle");return v;}
 public Vehicle create(String userId,Map<String,Object>b){return vehicles.save(new Vehicle(id(),userId,required(b,"name"),text(b,"make",null),text(b,"model",null),integer(b,"year",null)));}
 public Vehicle update(String userId,String id,Map<String,Object>b){Vehicle c=get(userId,id);return vehicles.save(new Vehicle(c.id(),c.userId(),text(b,"name",c.name()),text(b,"make",c.make()),text(b,"model",c.model()),integer(b,"year",c.year())));}
 public void delete(String userId,String id){get(userId,id);vehicles.deleteById(id);}
}