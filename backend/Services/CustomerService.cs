using MongoDB.Driver;
using CarRentalAPI.Models;

namespace CarRentalAPI.Services
{
    public interface ICustomerService
    {
        Task<List<Customer>> GetAllCustomersAsync();
        Task<Customer?> GetCustomerByIdAsync(string id);
        Task<Customer?> GetCustomerByEmailAsync(string email);
        Task<Customer> CreateCustomerAsync(CreateCustomerRequest request);
        Task<bool> UpdateCustomerAsync(string id, UpdateCustomerRequest request);
        Task<bool> DeleteCustomerAsync(string id);
    }

    public class CustomerService : ICustomerService
    {
        private readonly IMongoCollection<Customer> _customers;

        public CustomerService(IMongoClient mongoClient, IConfiguration configuration)
        {
            var database = mongoClient.GetDatabase(configuration["MongoDB:DatabaseName"]);
            _customers = database.GetCollection<Customer>("customers");
        }

        public async Task<List<Customer>> GetAllCustomersAsync()
        {
            return await _customers.Find(customer => true).ToListAsync();
        }

        public async Task<Customer?> GetCustomerByIdAsync(string id)
        {
            return await _customers.Find(customer => customer.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Customer?> GetCustomerByEmailAsync(string email)
        {
            return await _customers.Find(customer => customer.Email == email).FirstOrDefaultAsync();
        }

        public async Task<Customer> CreateCustomerAsync(CreateCustomerRequest request)
        {
            var customer = new Customer
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Phone = request.Phone,
                Address = request.Address,
                DateOfBirth = request.DateOfBirth,
                DriversLicense = request.DriversLicense,
                CreatedAt = DateTime.UtcNow
            };

            await _customers.InsertOneAsync(customer);
            return customer;
        }

        public async Task<bool> UpdateCustomerAsync(string id, UpdateCustomerRequest request)
        {
            var update = Builders<Customer>.Update.Set(customer => customer.UpdatedAt, DateTime.UtcNow);

            if (!string.IsNullOrEmpty(request.FirstName))
                update = update.Set(customer => customer.FirstName, request.FirstName);
            if (!string.IsNullOrEmpty(request.LastName))
                update = update.Set(customer => customer.LastName, request.LastName);
            if (!string.IsNullOrEmpty(request.Email))
                update = update.Set(customer => customer.Email, request.Email);
            if (!string.IsNullOrEmpty(request.Phone))
                update = update.Set(customer => customer.Phone, request.Phone);
            if (request.Address != null)
                update = update.Set(customer => customer.Address, request.Address);
            if (request.DateOfBirth.HasValue)
                update = update.Set(customer => customer.DateOfBirth, request.DateOfBirth.Value);
            if (!string.IsNullOrEmpty(request.DriversLicense))
                update = update.Set(customer => customer.DriversLicense, request.DriversLicense);

            var result = await _customers.UpdateOneAsync(customer => customer.Id == id, update);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteCustomerAsync(string id)
        {
            var result = await _customers.DeleteOneAsync(customer => customer.Id == id);
            return result.DeletedCount > 0;
        }
    }
}
