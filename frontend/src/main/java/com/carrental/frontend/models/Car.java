package com.carrental.frontend.models;

import java.math.BigDecimal;

public class Car {
    private String id;
    private String make;
    private String model;
    private int year;
    private String color;
    private String licensePlate;
    private BigDecimal dailyRate;
    private boolean isAvailable;
    private String fuelType;
    private String transmission;
    private int seats;
    private String imageUrl;
    private String description;

    // Constructors
    public Car() {}

    public Car(String make, String model, int year, String color, String licensePlate, 
               BigDecimal dailyRate, String fuelType, String transmission, int seats) {
        this.make = make;
        this.model = model;
        this.year = year;
        this.color = color;
        this.licensePlate = licensePlate;
        this.dailyRate = dailyRate;
        this.fuelType = fuelType;
        this.transmission = transmission;
        this.seats = seats;
        this.isAvailable = true;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }

    public BigDecimal getDailyRate() { return dailyRate; }
    public void setDailyRate(BigDecimal dailyRate) { this.dailyRate = dailyRate; }

    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }

    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }

    public String getTransmission() { return transmission; }
    public void setTransmission(String transmission) { this.transmission = transmission; }

    public int getSeats() { return seats; }
    public void setSeats(int seats) { this.seats = seats; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    @Override
    public String toString() {
        return year + " " + make + " " + model + " - $" + dailyRate + "/day";
    }
}
