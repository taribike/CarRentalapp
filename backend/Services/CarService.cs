using MongoDB.Driver;
using CarRentalAPI.Models;

namespace CarRentalAPI.Services
{
    public interface ICarService
    {
        Task<List<Car>> GetAllCarsAsync();
        Task<Car?> GetCarByIdAsync(string id);
        Task<List<Car>> SearchCarsAsync(CarSearchRequest searchRequest);
        Task<Car> CreateCarAsync(CreateCarRequest request);
        Task<bool> UpdateCarAsync(string id, UpdateCarRequest request);
        Task<bool> DeleteCarAsync(string id);
        Task<bool> IsCarAvailableAsync(string carId, DateTime from, DateTime to);
    }

    public class CarService : ICarService
    {
        private readonly IMongoCollection<Car> _cars;
        private readonly IMongoCollection<Booking> _bookings;

        public CarService(IMongoClient mongoClient, IConfiguration configuration)
        {
            var database = mongoClient.GetDatabase(configuration["MongoDB:DatabaseName"]);
            _cars = database.GetCollection<Car>("cars");
            _bookings = database.GetCollection<Booking>("bookings");
        }

        public async Task<List<Car>> GetAllCarsAsync()
        {
            return await _cars.Find(car => true).ToListAsync();
        }

        public async Task<Car?> GetCarByIdAsync(string id)
        {
            return await _cars.Find(car => car.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<Car>> SearchCarsAsync(CarSearchRequest searchRequest)
        {
            var filter = Builders<Car>.Filter.Empty;

            if (!string.IsNullOrEmpty(searchRequest.Make))
                filter &= Builders<Car>.Filter.Eq(car => car.Make, searchRequest.Make);

            if (!string.IsNullOrEmpty(searchRequest.Model))
                filter &= Builders<Car>.Filter.Eq(car => car.Model, searchRequest.Model);

            if (searchRequest.MinYear.HasValue)
                filter &= Builders<Car>.Filter.Gte(car => car.Year, searchRequest.MinYear.Value);

            if (searchRequest.MaxYear.HasValue)
                filter &= Builders<Car>.Filter.Lte(car => car.Year, searchRequest.MaxYear.Value);

            if (searchRequest.MaxDailyRate.HasValue)
                filter &= Builders<Car>.Filter.Lte(car => car.DailyRate, searchRequest.MaxDailyRate.Value);

            if (!string.IsNullOrEmpty(searchRequest.FuelType))
                filter &= Builders<Car>.Filter.Eq(car => car.FuelType, searchRequest.FuelType);

            if (!string.IsNullOrEmpty(searchRequest.Transmission))
                filter &= Builders<Car>.Filter.Eq(car => car.Transmission, searchRequest.Transmission);

            if (searchRequest.MinSeats.HasValue)
                filter &= Builders<Car>.Filter.Gte(car => car.Seats, searchRequest.MinSeats.Value);

            if (searchRequest.IsAvailable.HasValue)
                filter &= Builders<Car>.Filter.Eq(car => car.IsAvailable, searchRequest.IsAvailable.Value);

            var cars = await _cars.Find(filter).ToListAsync();

            // Filter by availability dates if specified
            if (searchRequest.AvailableFrom.HasValue && searchRequest.AvailableTo.HasValue)
            {
                var availableCars = new List<Car>();
                foreach (var car in cars)
                {
                    if (await IsCarAvailableAsync(car.Id!, searchRequest.AvailableFrom.Value, searchRequest.AvailableTo.Value))
                    {
                        availableCars.Add(car);
                    }
                }
                return availableCars;
            }

            return cars;
        }

        public async Task<Car> CreateCarAsync(CreateCarRequest request)
        {
            var car = new Car
            {
                Make = request.Make,
                Model = request.Model,
                Year = request.Year,
                Color = request.Color,
                LicensePlate = request.LicensePlate,
                DailyRate = request.DailyRate,
                FuelType = request.FuelType,
                Transmission = request.Transmission,
                Seats = request.Seats,
                ImageUrl = request.ImageUrl,
                Description = request.Description,
                IsAvailable = true
            };

            await _cars.InsertOneAsync(car);
            return car;
        }

        public async Task<bool> UpdateCarAsync(string id, UpdateCarRequest request)
        {
            var update = Builders<Car>.Update.Set(car => car.UpdatedAt, DateTime.UtcNow);

            if (!string.IsNullOrEmpty(request.Make))
                update = update.Set(car => car.Make, request.Make);
            if (!string.IsNullOrEmpty(request.Model))
                update = update.Set(car => car.Model, request.Model);
            if (request.Year.HasValue)
                update = update.Set(car => car.Year, request.Year.Value);
            if (!string.IsNullOrEmpty(request.Color))
                update = update.Set(car => car.Color, request.Color);
            if (!string.IsNullOrEmpty(request.LicensePlate))
                update = update.Set(car => car.LicensePlate, request.LicensePlate);
            if (request.DailyRate.HasValue)
                update = update.Set(car => car.DailyRate, request.DailyRate.Value);
            if (request.IsAvailable.HasValue)
                update = update.Set(car => car.IsAvailable, request.IsAvailable.Value);
            if (!string.IsNullOrEmpty(request.FuelType))
                update = update.Set(car => car.FuelType, request.FuelType);
            if (!string.IsNullOrEmpty(request.Transmission))
                update = update.Set(car => car.Transmission, request.Transmission);
            if (request.Seats.HasValue)
                update = update.Set(car => car.Seats, request.Seats.Value);
            if (request.ImageUrl != null)
                update = update.Set(car => car.ImageUrl, request.ImageUrl);
            if (request.Description != null)
                update = update.Set(car => car.Description, request.Description);

            var result = await _cars.UpdateOneAsync(car => car.Id == id, update);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteCarAsync(string id)
        {
            var result = await _cars.DeleteOneAsync(car => car.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<bool> IsCarAvailableAsync(string carId, DateTime from, DateTime to)
        {
            var conflictingBookings = await _bookings.Find(booking =>
                booking.CarId == carId &&
                booking.Status != BookingStatus.Cancelled &&
                ((booking.PickupDate <= from && booking.ReturnDate > from) ||
                 (booking.PickupDate < to && booking.ReturnDate >= to) ||
                 (booking.PickupDate >= from && booking.ReturnDate <= to)))
                .AnyAsync();

            return !conflictingBookings;
        }
    }
}
