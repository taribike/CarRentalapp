package com.carrental.frontend.services;

import com.carrental.frontend.models.Car;
import com.carrental.frontend.models.Customer;
import com.carrental.frontend.models.Booking;
import com.carrental.frontend.utils.ApiClient;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

public class CarRentalService {
    private final ApiClient apiClient;
    private final Gson gson;
    private final String baseUrl;

    public CarRentalService(String baseUrl) {
        this.baseUrl = baseUrl;
        this.apiClient = new ApiClient();
        this.gson = new Gson();
    }

    // Car operations
    public List<Car> getAllCars() throws IOException {
        String response = apiClient.get(baseUrl + "/api/cars");
        Type listType = new TypeToken<List<Car>>(){}.getType();
        return gson.fromJson(response, listType);
    }

    public Car getCarById(String id) throws IOException {
        String response = apiClient.get(baseUrl + "/api/cars/" + id);
        return gson.fromJson(response, Car.class);
    }

    public List<Car> searchCars(Map<String, Object> searchCriteria) throws IOException {
        String json = gson.toJson(searchCriteria);
        String response = apiClient.post(baseUrl + "/api/cars/search", json);
        Type listType = new TypeToken<List<Car>>(){}.getType();
        return gson.fromJson(response, listType);
    }

    public Car createCar(Car car) throws IOException {
        String json = gson.toJson(car);
        String response = apiClient.post(baseUrl + "/api/cars", json);
        return gson.fromJson(response, Car.class);
    }

    public boolean updateCar(String id, Car car) throws IOException {
        String json = gson.toJson(car);
        int statusCode = apiClient.put(baseUrl + "/api/cars/" + id, json);
        return statusCode == 204; // No Content
    }

    public boolean deleteCar(String id) throws IOException {
        int statusCode = apiClient.delete(baseUrl + "/api/cars/" + id);
        return statusCode == 204; // No Content
    }

    public boolean isCarAvailable(String carId, String from, String to) throws IOException {
        String url = baseUrl + "/api/cars/" + carId + "/availability?from=" + from + "&to=" + to;
        String response = apiClient.get(url);
        return Boolean.parseBoolean(response);
    }

    // Customer operations
    public List<Customer> getAllCustomers() throws IOException {
        String response = apiClient.get(baseUrl + "/api/customers");
        Type listType = new TypeToken<List<Customer>>(){}.getType();
        return gson.fromJson(response, listType);
    }

    public Customer getCustomerById(String id) throws IOException {
        String response = apiClient.get(baseUrl + "/api/customers/" + id);
        return gson.fromJson(response, Customer.class);
    }

    public Customer getCustomerByEmail(String email) throws IOException {
        String response = apiClient.get(baseUrl + "/api/customers/email/" + email);
        return gson.fromJson(response, Customer.class);
    }

    public Customer createCustomer(Customer customer) throws IOException {
        String json = gson.toJson(customer);
        String response = apiClient.post(baseUrl + "/api/customers", json);
        return gson.fromJson(response, Customer.class);
    }

    public boolean updateCustomer(String id, Customer customer) throws IOException {
        String json = gson.toJson(customer);
        int statusCode = apiClient.put(baseUrl + "/api/customers/" + id, json);
        return statusCode == 204; // No Content
    }

    public boolean deleteCustomer(String id) throws IOException {
        int statusCode = apiClient.delete(baseUrl + "/api/customers/" + id);
        return statusCode == 204; // No Content
    }

    // Booking operations
    public List<Booking> getAllBookings() throws IOException {
        String response = apiClient.get(baseUrl + "/api/bookings");
        Type listType = new TypeToken<List<Booking>>(){}.getType();
        return gson.fromJson(response, listType);
    }

    public Booking getBookingById(String id) throws IOException {
        String response = apiClient.get(baseUrl + "/api/bookings/" + id);
        return gson.fromJson(response, Booking.class);
    }

    public List<Booking> getBookingsByCustomer(String customerId) throws IOException {
        String response = apiClient.get(baseUrl + "/api/bookings/customer/" + customerId);
        Type listType = new TypeToken<List<Booking>>(){}.getType();
        return gson.fromJson(response, listType);
    }

    public List<Booking> getBookingsByCar(String carId) throws IOException {
        String response = apiClient.get(baseUrl + "/api/bookings/car/" + carId);
        Type listType = new TypeToken<List<Booking>>(){}.getType();
        return gson.fromJson(response, listType);
    }

    public Booking createBooking(Booking booking) throws IOException {
        String json = gson.toJson(booking);
        String response = apiClient.post(baseUrl + "/api/bookings", json);
        return gson.fromJson(response, Booking.class);
    }

    public boolean updateBooking(String id, Booking booking) throws IOException {
        String json = gson.toJson(booking);
        int statusCode = apiClient.put(baseUrl + "/api/bookings/" + id, json);
        return statusCode == 204; // No Content
    }

    public boolean cancelBooking(String id) throws IOException {
        int statusCode = apiClient.put(baseUrl + "/api/bookings/" + id + "/cancel", "");
        return statusCode == 204; // No Content
    }

    public boolean deleteBooking(String id) throws IOException {
        int statusCode = apiClient.delete(baseUrl + "/api/bookings/" + id);
        return statusCode == 204; // No Content
    }
}
