using MongoDB.Driver;
using CarRentalAPI.Models;

namespace CarRentalAPI.Services
{
    public interface IBookingService
    {
        Task<List<BookingResponse>> GetAllBookingsAsync();
        Task<BookingResponse?> GetBookingByIdAsync(string id);
        Task<List<BookingResponse>> GetBookingsByCustomerIdAsync(string customerId);
        Task<List<BookingResponse>> GetBookingsByCarIdAsync(string carId);
        Task<Booking> CreateBookingAsync(CreateBookingRequest request);
        Task<bool> UpdateBookingAsync(string id, UpdateBookingRequest request);
        Task<bool> CancelBookingAsync(string id);
        Task<bool> DeleteBookingAsync(string id);
    }

    public class BookingService : IBookingService
    {
        private readonly IMongoCollection<Booking> _bookings;
        private readonly IMongoCollection<Customer> _customers;
        private readonly IMongoCollection<Car> _cars;

        public BookingService(IMongoClient mongoClient, IConfiguration configuration)
        {
            var database = mongoClient.GetDatabase(configuration["MongoDB:DatabaseName"]);
            _bookings = database.GetCollection<Booking>("bookings");
            _customers = database.GetCollection<Customer>("customers");
            _cars = database.GetCollection<Car>("cars");
        }

        public async Task<List<BookingResponse>> GetAllBookingsAsync()
        {
            var bookings = await _bookings.Find(booking => true).ToListAsync();
            return await ConvertToBookingResponses(bookings);
        }

        public async Task<BookingResponse?> GetBookingByIdAsync(string id)
        {
            var booking = await _bookings.Find(b => b.Id == id).FirstOrDefaultAsync();
            if (booking == null) return null;

            var responses = await ConvertToBookingResponses(new List<Booking> { booking });
            return responses.FirstOrDefault();
        }

        public async Task<List<BookingResponse>> GetBookingsByCustomerIdAsync(string customerId)
        {
            var bookings = await _bookings.Find(b => b.CustomerId == customerId).ToListAsync();
            return await ConvertToBookingResponses(bookings);
        }

        public async Task<List<BookingResponse>> GetBookingsByCarIdAsync(string carId)
        {
            var bookings = await _bookings.Find(b => b.CarId == carId).ToListAsync();
            return await ConvertToBookingResponses(bookings);
        }

        public async Task<Booking> CreateBookingAsync(CreateBookingRequest request)
        {
            // Validate dates
            if (request.PickupDate >= request.ReturnDate)
                throw new ArgumentException("Pickup date must be before return date");

            if (request.PickupDate < DateTime.Today)
                throw new ArgumentException("Pickup date cannot be in the past");

            // Get car details
            var car = await _cars.Find(c => c.Id == request.CarId).FirstOrDefaultAsync();
            if (car == null)
                throw new ArgumentException("Car not found");

            if (!car.IsAvailable)
                throw new ArgumentException("Car is not available");

            // Check if car is available for the requested dates
            var conflictingBookings = await _bookings.Find(b =>
                b.CarId == request.CarId &&
                b.Status != BookingStatus.Cancelled &&
                ((b.PickupDate <= request.PickupDate && b.ReturnDate > request.PickupDate) ||
                 (b.PickupDate < request.ReturnDate && b.ReturnDate >= request.ReturnDate) ||
                 (b.PickupDate >= request.PickupDate && b.ReturnDate <= request.ReturnDate)))
                .AnyAsync();

            if (conflictingBookings)
                throw new ArgumentException("Car is not available for the requested dates");

            var totalDays = (int)(request.ReturnDate - request.PickupDate).TotalDays;
            var totalAmount = car.DailyRate * totalDays;

            var booking = new Booking
            {
                CustomerId = request.CustomerId,
                CarId = request.CarId,
                PickupDate = request.PickupDate,
                ReturnDate = request.ReturnDate,
                TotalDays = totalDays,
                DailyRate = car.DailyRate,
                TotalAmount = totalAmount,
                Status = BookingStatus.Pending,
                PickupLocation = request.PickupLocation,
                ReturnLocation = request.ReturnLocation,
                Notes = request.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _bookings.InsertOneAsync(booking);
            return booking;
        }

        public async Task<bool> UpdateBookingAsync(string id, UpdateBookingRequest request)
        {
            var update = Builders<Booking>.Update.Set(booking => booking.UpdatedAt, DateTime.UtcNow);

            if (request.PickupDate.HasValue)
                update = update.Set(booking => booking.PickupDate, request.PickupDate.Value);
            if (request.ReturnDate.HasValue)
                update = update.Set(booking => booking.ReturnDate, request.ReturnDate.Value);
            if (request.Status.HasValue)
                update = update.Set(booking => booking.Status, request.Status.Value);
            if (!string.IsNullOrEmpty(request.PickupLocation))
                update = update.Set(booking => booking.PickupLocation, request.PickupLocation);
            if (!string.IsNullOrEmpty(request.ReturnLocation))
                update = update.Set(booking => booking.ReturnLocation, request.ReturnLocation);
            if (request.Notes != null)
                update = update.Set(booking => booking.Notes, request.Notes);

            // Recalculate total if dates changed
            if (request.PickupDate.HasValue || request.ReturnDate.HasValue)
            {
                var booking = await _bookings.Find(b => b.Id == id).FirstOrDefaultAsync();
                if (booking != null)
                {
                    var pickupDate = request.PickupDate ?? booking.PickupDate;
                    var returnDate = request.ReturnDate ?? booking.ReturnDate;
                    var totalDays = (int)(returnDate - pickupDate).TotalDays;
                    update = update.Set(b => b.TotalDays, totalDays)
                                  .Set(b => b.TotalAmount, booking.DailyRate * totalDays);
                }
            }

            var result = await _bookings.UpdateOneAsync(booking => booking.Id == id, update);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> CancelBookingAsync(string id)
        {
            var update = Builders<Booking>.Update
                .Set(booking => booking.Status, BookingStatus.Cancelled)
                .Set(booking => booking.UpdatedAt, DateTime.UtcNow);

            var result = await _bookings.UpdateOneAsync(booking => booking.Id == id, update);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteBookingAsync(string id)
        {
            var result = await _bookings.DeleteOneAsync(booking => booking.Id == id);
            return result.DeletedCount > 0;
        }

        private async Task<List<BookingResponse>> ConvertToBookingResponses(List<Booking> bookings)
        {
            var responses = new List<BookingResponse>();

            foreach (var booking in bookings)
            {
                var customer = await _customers.Find(c => c.Id == booking.CustomerId).FirstOrDefaultAsync();
                var car = await _cars.Find(c => c.Id == booking.CarId).FirstOrDefaultAsync();

                responses.Add(new BookingResponse
                {
                    Id = booking.Id!,
                    CustomerId = booking.CustomerId,
                    CarId = booking.CarId,
                    CustomerName = customer != null ? $"{customer.FirstName} {customer.LastName}" : "Unknown",
                    CarInfo = car != null ? $"{car.Year} {car.Make} {car.Model}" : "Unknown",
                    PickupDate = booking.PickupDate,
                    ReturnDate = booking.ReturnDate,
                    TotalDays = booking.TotalDays,
                    DailyRate = booking.DailyRate,
                    TotalAmount = booking.TotalAmount,
                    Status = booking.Status,
                    PickupLocation = booking.PickupLocation,
                    ReturnLocation = booking.ReturnLocation,
                    CreatedAt = booking.CreatedAt,
                    UpdatedAt = booking.UpdatedAt,
                    Notes = booking.Notes
                });
            }

            return responses;
        }
    }
}
