export enum BookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Active = 'Active',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface Booking {
  id: string;
  customerId: string;
  carId: string;
  customerName: string;
  carInfo: string;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  dailyRate: number;
  totalAmount: number;
  status: BookingStatus;
  pickupLocation: string;
  returnLocation: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface CreateBookingRequest {
  customerId: string;
  carId: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  notes?: string;
}

export interface UpdateBookingRequest {
  pickupDate?: string;
  returnDate?: string;
  status?: BookingStatus;
  pickupLocation?: string;
  returnLocation?: string;
  notes?: string;
}

