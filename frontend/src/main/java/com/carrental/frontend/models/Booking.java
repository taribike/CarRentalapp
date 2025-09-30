package com.carrental.frontend.models;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class Booking {
    private String id;
    private String customerId;
    private String carId;
    private LocalDate pickupDate;
    private LocalDate returnDate;
    private int totalDays;
    private BigDecimal dailyRate;
    private BigDecimal totalAmount;
    private BookingStatus status;
    private String pickupLocation;
    private String returnLocation;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String notes;

    // Additional fields for display
    private String customerName;
    private String carInfo;

    // Constructors
    public Booking() {}

    public Booking(String customerId, String carId, LocalDate pickupDate, 
                   LocalDate returnDate, String pickupLocation, String returnLocation) {
        this.customerId = customerId;
        this.carId = carId;
        this.pickupDate = pickupDate;
        this.returnDate = returnDate;
        this.pickupLocation = pickupLocation;
        this.returnLocation = returnLocation;
        this.status = BookingStatus.PENDING;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getCarId() { return carId; }
    public void setCarId(String carId) { this.carId = carId; }

    public LocalDate getPickupDate() { return pickupDate; }
    public void setPickupDate(LocalDate pickupDate) { this.pickupDate = pickupDate; }

    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }

    public int getTotalDays() { return totalDays; }
    public void setTotalDays(int totalDays) { this.totalDays = totalDays; }

    public BigDecimal getDailyRate() { return dailyRate; }
    public void setDailyRate(BigDecimal dailyRate) { this.dailyRate = dailyRate; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getReturnLocation() { return returnLocation; }
    public void setReturnLocation(String returnLocation) { this.returnLocation = returnLocation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCarInfo() { return carInfo; }
    public void setCarInfo(String carInfo) { this.carInfo = carInfo; }

    @Override
    public String toString() {
        return "Booking: " + carInfo + " - " + pickupDate + " to " + returnDate + 
               " (" + status + ")";
    }
}
