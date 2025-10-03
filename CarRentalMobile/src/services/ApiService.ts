import AsyncStorage from '@react-native-async-storage/async-storage';
import {Config} from '../constants/Config';

const BASE_URL = Config.API_BASE_URL;

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Cars API
  async getAllCars(): Promise<any[]> {
    return this.makeRequest<any[]>('/cars');
  }

  async getCar(id: string): Promise<any> {
    return this.makeRequest<any>(`/cars/${id}`);
  }

  async searchCars(searchRequest: any): Promise<any[]> {
    return this.makeRequest<any[]>('/cars/search', {
      method: 'POST',
      body: JSON.stringify(searchRequest),
    });
  }

  async checkCarAvailability(id: string, from: string, to: string): Promise<boolean> {
    return this.makeRequest<boolean>(`/cars/${id}/availability?from=${from}&to=${to}`);
  }

  // Customers API
  async getAllCustomers(): Promise<any[]> {
    return this.makeRequest<any[]>('/customers');
  }

  async getCustomer(id: string): Promise<any> {
    return this.makeRequest<any>(`/customers/${id}`);
  }

  async getCustomerByEmail(email: string): Promise<any> {
    return this.makeRequest<any>(`/customers/email/${encodeURIComponent(email)}`);
  }

  async createCustomer(customer: any): Promise<any> {
    return this.makeRequest<any>('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  }

  async updateCustomer(id: string, customer: any): Promise<boolean> {
    const response = await this.makeRequest(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customer),
    });
    return true; // Assuming 204 No Content response
  }

  async deleteCustomer(id: string): Promise<boolean> {
    await this.makeRequest(`/customers/${id}`, {
      method: 'DELETE',
    });
    return true;
  }

  // Bookings API
  async getAllBookings(): Promise<any[]> {
    return this.makeRequest<any[]>('/bookings');
  }

  async getBooking(id: string): Promise<any> {
    return this.makeRequest<any>(`/bookings/${id}`);
  }

  async getBookingsByCustomer(customerId: string): Promise<any[]> {
    return this.makeRequest<any[]>(`/bookings/customer/${customerId}`);
  }

  async getBookingsByCar(carId: string): Promise<any[]> {
    return this.makeRequest<any[]>(`/bookings/car/${carId}`);
  }

  async createBooking(booking: any): Promise<any> {
    return this.makeRequest<any>('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  async updateBooking(id: string, booking: any): Promise<boolean> {
    await this.makeRequest(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(booking),
    });
    return true;
  }

  async cancelBooking(id: string): Promise<boolean> {
    await this.makeRequest(`/bookings/${id}/cancel`, {
      method: 'POST',
    });
    return true;
  }

  // Payments API
  async createPayment(payment: any): Promise<any> {
    return this.makeRequest<any>('/payments', {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  }

  async getPayment(id: string): Promise<any> {
    return this.makeRequest<any>(`/payments/${id}`);
  }

  async getPaymentsByBooking(bookingId: string): Promise<any[]> {
    return this.makeRequest<any[]>(`/payments/booking/${bookingId}`);
  }

  async getPaymentsByCustomer(customerId: string): Promise<any[]> {
    return this.makeRequest<any[]>(`/payments/customer/${customerId}`);
  }

  // Stripe API
  async createStripePaymentIntent(request: any): Promise<any> {
    return this.makeRequest<any>('/payments/stripe/create-intent', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async confirmStripePayment(request: any): Promise<any> {
    return this.makeRequest<any>('/payments/stripe/confirm', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // PayPal API
  async createPayPalOrder(request: any): Promise<any> {
    return this.makeRequest<any>('/payments/paypal/create-order', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async capturePayPalPayment(request: any): Promise<boolean> {
    return this.makeRequest<boolean>('/payments/paypal/capture', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Refunds
  async refundPayment(paymentId: string, amount?: number): Promise<boolean> {
    const body = amount ? { amount } : {};
    return this.makeRequest<boolean>(`/payments/${paymentId}/refund`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Update payment status
  async updatePaymentStatus(paymentId: string, status: string): Promise<any> {
    return this.makeRequest<any>(`/payments/${paymentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
}

export default new ApiService();

