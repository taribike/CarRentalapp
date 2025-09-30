// Sample Customers Data for Car Rental Database
// Run this script in MongoDB to populate the customers collection

db = db.getSiblingDB('CarRentalDB');

db.customers.insertMany([
  {
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@email.com",
    "phone": "555-0101",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "dateOfBirth": "1985-03-15",
    "driversLicense": "DL123456789",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "firstName": "Sarah",
    "lastName": "Johnson",
    "email": "sarah.johnson@email.com",
    "phone": "555-0102",
    "address": {
      "street": "456 Oak Ave",
      "city": "Los Angeles",
      "state": "CA",
      "zipCode": "90210",
      "country": "USA"
    },
    "dateOfBirth": "1990-07-22",
    "driversLicense": "DL987654321",
    "createdAt": "2024-01-16T14:20:00Z"
  },
  {
    "firstName": "Michael",
    "lastName": "Brown",
    "email": "michael.brown@email.com",
    "phone": "555-0103",
    "address": {
      "street": "789 Pine St",
      "city": "Chicago",
      "state": "IL",
      "zipCode": "60601",
      "country": "USA"
    },
    "dateOfBirth": "1988-11-08",
    "driversLicense": "DL456789123",
    "createdAt": "2024-01-17T09:15:00Z"
  },
  {
    "firstName": "Emily",
    "lastName": "Davis",
    "email": "emily.davis@email.com",
    "phone": "555-0104",
    "address": {
      "street": "321 Elm St",
      "city": "Houston",
      "state": "TX",
      "zipCode": "77001",
      "country": "USA"
    },
    "dateOfBirth": "1992-05-12",
    "driversLicense": "DL789123456",
    "createdAt": "2024-01-18T16:45:00Z"
  },
  {
    "firstName": "David",
    "lastName": "Wilson",
    "email": "david.wilson@email.com",
    "phone": "555-0105",
    "address": {
      "street": "654 Maple Ave",
      "city": "Phoenix",
      "state": "AZ",
      "zipCode": "85001",
      "country": "USA"
    },
    "dateOfBirth": "1987-09-30",
    "driversLicense": "DL321654987",
    "createdAt": "2024-01-19T11:30:00Z"
  },
  {
    "firstName": "Lisa",
    "lastName": "Anderson",
    "email": "lisa.anderson@email.com",
    "phone": "555-0106",
    "address": {
      "street": "987 Cedar St",
      "city": "Philadelphia",
      "state": "PA",
      "zipCode": "19101",
      "country": "USA"
    },
    "dateOfBirth": "1991-12-03",
    "driversLicense": "DL654987321",
    "createdAt": "2024-01-20T13:20:00Z"
  },
  {
    "firstName": "Robert",
    "lastName": "Taylor",
    "email": "robert.taylor@email.com",
    "phone": "555-0107",
    "address": {
      "street": "147 Birch St",
      "city": "San Antonio",
      "state": "TX",
      "zipCode": "78201",
      "country": "USA"
    },
    "dateOfBirth": "1986-04-18",
    "driversLicense": "DL147258369",
    "createdAt": "2024-01-21T08:45:00Z"
  },
  {
    "firstName": "Jennifer",
    "lastName": "Thomas",
    "email": "jennifer.thomas@email.com",
    "phone": "555-0108",
    "address": {
      "street": "258 Spruce Ave",
      "city": "San Diego",
      "state": "CA",
      "zipCode": "92101",
      "country": "USA"
    },
    "dateOfBirth": "1989-08-25",
    "driversLicense": "DL258369147",
    "createdAt": "2024-01-22T15:10:00Z"
  },
  {
    "firstName": "Christopher",
    "lastName": "Jackson",
    "email": "christopher.jackson@email.com",
    "phone": "555-0109",
    "address": {
      "street": "369 Willow St",
      "city": "Dallas",
      "state": "TX",
      "zipCode": "75201",
      "country": "USA"
    },
    "dateOfBirth": "1984-01-14",
    "driversLicense": "DL369147258",
    "createdAt": "2024-01-23T12:30:00Z"
  },
  {
    "firstName": "Amanda",
    "lastName": "White",
    "email": "amanda.white@email.com",
    "phone": "555-0110",
    "address": {
      "street": "741 Poplar Ave",
      "city": "San Jose",
      "state": "CA",
      "zipCode": "95101",
      "country": "USA"
    },
    "dateOfBirth": "1993-06-07",
    "driversLicense": "DL741852963",
    "createdAt": "2024-01-24T17:25:00Z"
  }
]);

print("Sample customers data inserted successfully!");
