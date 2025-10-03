export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  dailyRate: number;
  isAvailable: boolean;
  fuelType: string;
  transmission: string;
  seats: number;
  imageUrl?: string;
  description?: string;
}

export interface CarSearchRequest {
  pickupDate?: string;
  returnDate?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  fuelType?: string;
  transmission?: string;
  seats?: number;
}

export interface CreateCarRequest {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  dailyRate: number;
  fuelType: string;
  transmission: string;
  seats: number;
  imageUrl?: string;
  description?: string;
}

export interface UpdateCarRequest {
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  licensePlate?: string;
  dailyRate?: number;
  isAvailable?: boolean;
  fuelType?: string;
  transmission?: string;
  seats?: number;
  imageUrl?: string;
  description?: string;
}

