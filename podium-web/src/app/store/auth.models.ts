import { DistanceUnit, TemperatureUnit } from '../preferences';

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  distanceUnit?: DistanceUnit;
  temperatureUnit?: TemperatureUnit;
  defaultTrackId?: number | null;
  defaultVehicleId?: number | null;
}

export interface AuthState {
  user: AuthUser | null;
  rehydrating: boolean;
}
