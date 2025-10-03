package com.carrental.frontend;

import com.carrental.frontend.models.Car;
import com.carrental.frontend.models.Customer;
import com.carrental.frontend.models.Booking;
import com.carrental.frontend.services.CarRentalService;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class CarRentalApp extends JFrame {
    private CarRentalService carRentalService;
    private JTabbedPane tabbedPane;
    
    // Car management components
    private JTable carTable;
    private DefaultTableModel carTableModel;
    private JTextField makeField, modelField, yearField, colorField, licenseField, rateField;
    private JTextField fuelField, transmissionField, seatsField, imageField, descField;
    
    // Customer management components
    private JTable customerTable;
    private DefaultTableModel customerTableModel;
    private JTextField firstNameField, lastNameField, emailField, phoneField;
    private JTextField streetField, cityField, stateField, zipField, countryField;
    private JTextField dobField, driversLicenseField;
    
    // Booking components
    private JTable bookingTable;
    private DefaultTableModel bookingTableModel;
    private JComboBox<Customer> customerCombo;
    private JComboBox<Car> carCombo;
    private JTextField pickupDateField, returnDateField;
    private JTextField pickupLocationField, returnLocationField;
    private JTextArea notesArea;

    public CarRentalApp() {
        this.carRentalService = new CarRentalService("http://localhost:5000");
        initializeUI();
        loadData();
    }

    private void initializeUI() {
        setTitle("Car Rental Management System");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1200, 800);
        setLocationRelativeTo(null);

        tabbedPane = new JTabbedPane();
        
        // Create tabs
        tabbedPane.addTab("Cars", createCarManagementPanel());
        tabbedPane.addTab("Customers", createCustomerManagementPanel());
        tabbedPane.addTab("Bookings", createBookingManagementPanel());
        
        add(tabbedPane);
    }

    private JPanel createCarManagementPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        
        // Car table
        String[] carColumns = {"ID", "Make", "Model", "Year", "Color", "License", "Daily Rate", "Available", "Fuel", "Transmission", "Seats"};
        carTableModel = new DefaultTableModel(carColumns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        carTable = new JTable(carTableModel);
        carTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        
        JScrollPane carScrollPane = new JScrollPane(carTable);
        panel.add(carScrollPane, BorderLayout.CENTER);
        
        // Car form panel
        JPanel carFormPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        
        // Form fields
        makeField = new JTextField(15);
        modelField = new JTextField(15);
        yearField = new JTextField(15);
        colorField = new JTextField(15);
        licenseField = new JTextField(15);
        rateField = new JTextField(15);
        fuelField = new JTextField(15);
        transmissionField = new JTextField(15);
        seatsField = new JTextField(15);
        imageField = new JTextField(15);
        descField = new JTextField(15);
        
        // Add form fields
        addFormField(carFormPanel, gbc, "Make:", makeField, 0);
        addFormField(carFormPanel, gbc, "Model:", modelField, 1);
        addFormField(carFormPanel, gbc, "Year:", yearField, 2);
        addFormField(carFormPanel, gbc, "Color:", colorField, 3);
        addFormField(carFormPanel, gbc, "License:", licenseField, 4);
        addFormField(carFormPanel, gbc, "Daily Rate:", rateField, 5);
        addFormField(carFormPanel, gbc, "Fuel Type:", fuelField, 6);
        addFormField(carFormPanel, gbc, "Transmission:", transmissionField, 7);
        addFormField(carFormPanel, gbc, "Seats:", seatsField, 8);
        addFormField(carFormPanel, gbc, "Image URL:", imageField, 9);
        addFormField(carFormPanel, gbc, "Description:", descField, 10);
        
        // Buttons
        JPanel buttonPanel = new JPanel(new FlowLayout());
        JButton addCarBtn = new JButton("Add Car");
        JButton updateCarBtn = new JButton("Update Car");
        JButton deleteCarBtn = new JButton("Delete Car");
        JButton refreshCarBtn = new JButton("Refresh");
        
        addCarBtn.addActionListener(e -> addCar());
        updateCarBtn.addActionListener(e -> updateCar());
        deleteCarBtn.addActionListener(e -> deleteCar());
        refreshCarBtn.addActionListener(e -> loadCars());
        
        buttonPanel.add(addCarBtn);
        buttonPanel.add(updateCarBtn);
        buttonPanel.add(deleteCarBtn);
        buttonPanel.add(refreshCarBtn);
        
        carFormPanel.add(buttonPanel, gbc);
        gbc.gridy++;
        
        panel.add(carFormPanel, BorderLayout.SOUTH);
        
        return panel;
    }

    private JPanel createCustomerManagementPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        
        // Customer table
        String[] customerColumns = {"ID", "First Name", "Last Name", "Email", "Phone", "City", "State", "DOB", "License"};
        customerTableModel = new DefaultTableModel(customerColumns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        customerTable = new JTable(customerTableModel);
        customerTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        
        JScrollPane customerScrollPane = new JScrollPane(customerTable);
        panel.add(customerScrollPane, BorderLayout.CENTER);
        
        // Customer form panel
        JPanel customerFormPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        
        // Form fields
        firstNameField = new JTextField(15);
        lastNameField = new JTextField(15);
        emailField = new JTextField(15);
        phoneField = new JTextField(15);
        streetField = new JTextField(15);
        cityField = new JTextField(15);
        stateField = new JTextField(15);
        zipField = new JTextField(15);
        countryField = new JTextField(15);
        dobField = new JTextField(15);
        driversLicenseField = new JTextField(15);
        
        // Add form fields
        addFormField(customerFormPanel, gbc, "First Name:", firstNameField, 0);
        addFormField(customerFormPanel, gbc, "Last Name:", lastNameField, 1);
        addFormField(customerFormPanel, gbc, "Email:", emailField, 2);
        addFormField(customerFormPanel, gbc, "Phone:", phoneField, 3);
        addFormField(customerFormPanel, gbc, "Street:", streetField, 4);
        addFormField(customerFormPanel, gbc, "City:", cityField, 5);
        addFormField(customerFormPanel, gbc, "State:", stateField, 6);
        addFormField(customerFormPanel, gbc, "ZIP:", zipField, 7);
        addFormField(customerFormPanel, gbc, "Country:", countryField, 8);
        addFormField(customerFormPanel, gbc, "DOB (YYYY-MM-DD):", dobField, 9);
        addFormField(customerFormPanel, gbc, "Driver's License:", driversLicenseField, 10);
        
        // Buttons
        JPanel buttonPanel = new JPanel(new FlowLayout());
        JButton addCustomerBtn = new JButton("Add Customer");
        JButton updateCustomerBtn = new JButton("Update Customer");
        JButton deleteCustomerBtn = new JButton("Delete Customer");
        JButton refreshCustomerBtn = new JButton("Refresh");
        
        addCustomerBtn.addActionListener(e -> addCustomer());
        updateCustomerBtn.addActionListener(e -> updateCustomer());
        deleteCustomerBtn.addActionListener(e -> deleteCustomer());
        refreshCustomerBtn.addActionListener(e -> loadCustomers());
        
        buttonPanel.add(addCustomerBtn);
        buttonPanel.add(updateCustomerBtn);
        buttonPanel.add(deleteCustomerBtn);
        buttonPanel.add(refreshCustomerBtn);
        
        customerFormPanel.add(buttonPanel, gbc);
        gbc.gridy++;
        
        panel.add(customerFormPanel, BorderLayout.SOUTH);
        
        return panel;
    }

    private JPanel createBookingManagementPanel() {
        JPanel panel = new JPanel(new BorderLayout());
        
        // Booking table
        String[] bookingColumns = {"ID", "Customer", "Car", "Pickup Date", "Return Date", "Total Days", "Total Amount", "Status", "Pickup Location", "Return Location"};
        bookingTableModel = new DefaultTableModel(bookingColumns, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        bookingTable = new JTable(bookingTableModel);
        bookingTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        
        JScrollPane bookingScrollPane = new JScrollPane(bookingTable);
        panel.add(bookingScrollPane, BorderLayout.CENTER);
        
        // Booking form panel
        JPanel bookingFormPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        
        // Form fields
        customerCombo = new JComboBox<>();
        carCombo = new JComboBox<>();
        pickupDateField = new JTextField(15);
        returnDateField = new JTextField(15);
        pickupLocationField = new JTextField(15);
        returnLocationField = new JTextField(15);
        notesArea = new JTextArea(3, 20);
        notesArea.setLineWrap(true);
        notesArea.setWrapStyleWord(true);
        
        // Add form fields
        addFormField(bookingFormPanel, gbc, "Customer:", customerCombo, 0);
        addFormField(bookingFormPanel, gbc, "Car:", carCombo, 1);
        addFormField(bookingFormPanel, gbc, "Pickup Date (YYYY-MM-DD):", pickupDateField, 2);
        addFormField(bookingFormPanel, gbc, "Return Date (YYYY-MM-DD):", returnDateField, 3);
        addFormField(bookingFormPanel, gbc, "Pickup Location:", pickupLocationField, 4);
        addFormField(bookingFormPanel, gbc, "Return Location:", returnLocationField, 5);
        
        gbc.gridx = 0;
        gbc.gridy = 6;
        bookingFormPanel.add(new JLabel("Notes:"), gbc);
        gbc.gridx = 1;
        bookingFormPanel.add(new JScrollPane(notesArea), gbc);
        
        // Buttons
        JPanel buttonPanel = new JPanel(new FlowLayout());
        JButton addBookingBtn = new JButton("Create Booking");
        JButton cancelBookingBtn = new JButton("Cancel Booking");
        JButton refreshBookingBtn = new JButton("Refresh");
        
        addBookingBtn.addActionListener(e -> addBooking());
        cancelBookingBtn.addActionListener(e -> cancelBooking());
        refreshBookingBtn.addActionListener(e -> loadBookings());
        
        buttonPanel.add(addBookingBtn);
        buttonPanel.add(cancelBookingBtn);
        buttonPanel.add(refreshBookingBtn);
        
        gbc.gridx = 0;
        gbc.gridy = 7;
        gbc.gridwidth = 2;
        bookingFormPanel.add(buttonPanel, gbc);
        
        panel.add(bookingFormPanel, BorderLayout.SOUTH);
        
        return panel;
    }

    private void addFormField(JPanel panel, GridBagConstraints gbc, String label, JComponent component, int row) {
        gbc.gridx = 0;
        gbc.gridy = row;
        gbc.anchor = GridBagConstraints.WEST;
        panel.add(new JLabel(label), gbc);
        
        gbc.gridx = 1;
        gbc.anchor = GridBagConstraints.CENTER;
        panel.add(component, gbc);
    }

    private void loadData() {
        loadCars();
        loadCustomers();
        loadBookings();
    }

    private void loadCars() {
        try {
            List<Car> cars = carRentalService.getAllCars();
            carTableModel.setRowCount(0);
            
            for (Car car : cars) {
                Object[] row = {
                    car.getId(),
                    car.getMake(),
                    car.getModel(),
                    car.getYear(),
                    car.getColor(),
                    car.getLicensePlate(),
                    car.getDailyRate(),
                    car.isAvailable() ? "Yes" : "No",
                    car.getFuelType(),
                    car.getTransmission(),
                    car.getSeats()
                };
                carTableModel.addRow(row);
            }
        } catch (IOException e) {
            JOptionPane.showMessageDialog(this, "Error loading cars: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void loadCustomers() {
        try {
            List<Customer> customers = carRentalService.getAllCustomers();
            customerTableModel.setRowCount(0);
            customerCombo.removeAllItems();
            
            for (Customer customer : customers) {
                Object[] row = {
                    customer.getId(),
                    customer.getFirstName(),
                    customer.getLastName(),
                    customer.getEmail(),
                    customer.getPhone(),
                    customer.getAddress().getCity(),
                    customer.getAddress().getState(),
                    customer.getDateOfBirth(),
                    customer.getDriversLicense()
                };
                customerTableModel.addRow(row);
                customerCombo.addItem(customer);
            }
        } catch (IOException e) {
            JOptionPane.showMessageDialog(this, "Error loading customers: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void loadBookings() {
        try {
            List<Booking> bookings = carRentalService.getAllBookings();
            bookingTableModel.setRowCount(0);
            
            for (Booking booking : bookings) {
                Object[] row = {
                    booking.getId(),
                    booking.getCustomerName(),
                    booking.getCarInfo(),
                    booking.getPickupDate(),
                    booking.getReturnDate(),
                    booking.getTotalDays(),
                    booking.getTotalAmount(),
                    booking.getStatus(),
                    booking.getPickupLocation(),
                    booking.getReturnLocation()
                };
                bookingTableModel.addRow(row);
            }
        } catch (IOException e) {
            JOptionPane.showMessageDialog(this, "Error loading bookings: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void addCar() {
        try {
            Car car = new Car();
            car.setMake(makeField.getText());
            car.setModel(modelField.getText());
            car.setYear(Integer.parseInt(yearField.getText()));
            car.setColor(colorField.getText());
            car.setLicensePlate(licenseField.getText());
            car.setDailyRate(new BigDecimal(rateField.getText()));
            car.setFuelType(fuelField.getText());
            car.setTransmission(transmissionField.getText());
            car.setSeats(Integer.parseInt(seatsField.getText()));
            car.setImageUrl(imageField.getText());
            car.setDescription(descField.getText());
            
            carRentalService.createCar(car);
            clearCarFields();
            loadCars();
            JOptionPane.showMessageDialog(this, "Car added successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error adding car: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void updateCar() {
        int selectedRow = carTable.getSelectedRow();
        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(this, "Please select a car to update.", "Warning", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        try {
            String carId = (String) carTableModel.getValueAt(selectedRow, 0);
            Car car = new Car();
            car.setMake(makeField.getText());
            car.setModel(modelField.getText());
            car.setYear(Integer.parseInt(yearField.getText()));
            car.setColor(colorField.getText());
            car.setLicensePlate(licenseField.getText());
            car.setDailyRate(new BigDecimal(rateField.getText()));
            car.setFuelType(fuelField.getText());
            car.setTransmission(transmissionField.getText());
            car.setSeats(Integer.parseInt(seatsField.getText()));
            car.setImageUrl(imageField.getText());
            car.setDescription(descField.getText());
            
            boolean success = carRentalService.updateCar(carId, car);
            if (success) {
                clearCarFields();
                loadCars();
                JOptionPane.showMessageDialog(this, "Car updated successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(this, "Failed to update car.", "Error", JOptionPane.ERROR_MESSAGE);
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error updating car: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void deleteCar() {
        int selectedRow = carTable.getSelectedRow();
        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(this, "Please select a car to delete.", "Warning", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        int confirm = JOptionPane.showConfirmDialog(this, "Are you sure you want to delete this car?", "Confirm Delete", JOptionPane.YES_NO_OPTION);
        if (confirm == JOptionPane.YES_OPTION) {
            try {
                String carId = (String) carTableModel.getValueAt(selectedRow, 0);
                boolean success = carRentalService.deleteCar(carId);
                if (success) {
                    loadCars();
                    JOptionPane.showMessageDialog(this, "Car deleted successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
                } else {
                    JOptionPane.showMessageDialog(this, "Failed to delete car.", "Error", JOptionPane.ERROR_MESSAGE);
                }
            } catch (Exception e) {
                JOptionPane.showMessageDialog(this, "Error deleting car: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void addCustomer() {
        try {
            Customer customer = new Customer();
            customer.setFirstName(firstNameField.getText());
            customer.setLastName(lastNameField.getText());
            customer.setEmail(emailField.getText());
            customer.setPhone(phoneField.getText());
            customer.getAddress().setStreet(streetField.getText());
            customer.getAddress().setCity(cityField.getText());
            customer.getAddress().setState(stateField.getText());
            customer.getAddress().setZipCode(zipField.getText());
            customer.getAddress().setCountry(countryField.getText());
            customer.setDateOfBirth(LocalDate.parse(dobField.getText()));
            customer.setDriversLicense(driversLicenseField.getText());
            
            carRentalService.createCustomer(customer);
            clearCustomerFields();
            loadCustomers();
            JOptionPane.showMessageDialog(this, "Customer added successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error adding customer: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void updateCustomer() {
        int selectedRow = customerTable.getSelectedRow();
        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(this, "Please select a customer to update.", "Warning", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        try {
            String customerId = (String) customerTableModel.getValueAt(selectedRow, 0);
            Customer customer = new Customer();
            customer.setFirstName(firstNameField.getText());
            customer.setLastName(lastNameField.getText());
            customer.setEmail(emailField.getText());
            customer.setPhone(phoneField.getText());
            customer.getAddress().setStreet(streetField.getText());
            customer.getAddress().setCity(cityField.getText());
            customer.getAddress().setState(stateField.getText());
            customer.getAddress().setZipCode(zipField.getText());
            customer.getAddress().setCountry(countryField.getText());
            customer.setDateOfBirth(LocalDate.parse(dobField.getText()));
            customer.setDriversLicense(driversLicenseField.getText());
            
            boolean success = carRentalService.updateCustomer(customerId, customer);
            if (success) {
                clearCustomerFields();
                loadCustomers();
                JOptionPane.showMessageDialog(this, "Customer updated successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(this, "Failed to update customer.", "Error", JOptionPane.ERROR_MESSAGE);
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error updating customer: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void deleteCustomer() {
        int selectedRow = customerTable.getSelectedRow();
        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(this, "Please select a customer to delete.", "Warning", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        int confirm = JOptionPane.showConfirmDialog(this, "Are you sure you want to delete this customer?", "Confirm Delete", JOptionPane.YES_NO_OPTION);
        if (confirm == JOptionPane.YES_OPTION) {
            try {
                String customerId = (String) customerTableModel.getValueAt(selectedRow, 0);
                boolean success = carRentalService.deleteCustomer(customerId);
                if (success) {
                    loadCustomers();
                    JOptionPane.showMessageDialog(this, "Customer deleted successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
                } else {
                    JOptionPane.showMessageDialog(this, "Failed to delete customer.", "Error", JOptionPane.ERROR_MESSAGE);
                }
            } catch (Exception e) {
                JOptionPane.showMessageDialog(this, "Error deleting customer: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void addBooking() {
        try {
            Customer selectedCustomer = (Customer) customerCombo.getSelectedItem();
            Car selectedCar = (Car) carCombo.getSelectedItem();
            
            if (selectedCustomer == null || selectedCar == null) {
                JOptionPane.showMessageDialog(this, "Please select both customer and car.", "Warning", JOptionPane.WARNING_MESSAGE);
                return;
            }
            
            Booking booking = new Booking();
            booking.setCustomerId(selectedCustomer.getId());
            booking.setCarId(selectedCar.getId());
            booking.setPickupDate(LocalDate.parse(pickupDateField.getText()));
            booking.setReturnDate(LocalDate.parse(returnDateField.getText()));
            booking.setPickupLocation(pickupLocationField.getText());
            booking.setReturnLocation(returnLocationField.getText());
            booking.setNotes(notesArea.getText());
            
            carRentalService.createBooking(booking);
            clearBookingFields();
            loadBookings();
            JOptionPane.showMessageDialog(this, "Booking created successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error creating booking: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void cancelBooking() {
        int selectedRow = bookingTable.getSelectedRow();
        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(this, "Please select a booking to cancel.", "Warning", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        int confirm = JOptionPane.showConfirmDialog(this, "Are you sure you want to cancel this booking?", "Confirm Cancel", JOptionPane.YES_NO_OPTION);
        if (confirm == JOptionPane.YES_OPTION) {
            try {
                String bookingId = (String) bookingTableModel.getValueAt(selectedRow, 0);
                boolean success = carRentalService.cancelBooking(bookingId);
                if (success) {
                    loadBookings();
                    JOptionPane.showMessageDialog(this, "Booking cancelled successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
                } else {
                    JOptionPane.showMessageDialog(this, "Failed to cancel booking.", "Error", JOptionPane.ERROR_MESSAGE);
                }
            } catch (Exception e) {
                JOptionPane.showMessageDialog(this, "Error cancelling booking: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void clearCarFields() {
        makeField.setText("");
        modelField.setText("");
        yearField.setText("");
        colorField.setText("");
        licenseField.setText("");
        rateField.setText("");
        fuelField.setText("");
        transmissionField.setText("");
        seatsField.setText("");
        imageField.setText("");
        descField.setText("");
    }

    private void clearCustomerFields() {
        firstNameField.setText("");
        lastNameField.setText("");
        emailField.setText("");
        phoneField.setText("");
        streetField.setText("");
        cityField.setText("");
        stateField.setText("");
        zipField.setText("");
        countryField.setText("");
        dobField.setText("");
        driversLicenseField.setText("");
    }

    private void clearBookingFields() {
        customerCombo.setSelectedIndex(-1);
        carCombo.setSelectedIndex(-1);
        pickupDateField.setText("");
        returnDateField.setText("");
        pickupLocationField.setText("");
        returnLocationField.setText("");
        notesArea.setText("");
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception e) {
                e.printStackTrace();
            }
            new CarRentalApp().setVisible(true);
        });
    }
}
