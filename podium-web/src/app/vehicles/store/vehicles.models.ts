export interface Vehicle {
  id: number;
  userId: number;
  name: string;
  make: string | null;
  model: string | null;
  trim: string | null;
  year: number | null;
}

export interface VehiclesState {
  vehicles: Vehicle[] | undefined;
  loading: boolean;
  saving: boolean;
  error: string | null;
}
