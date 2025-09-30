namespace CarRentalAPI.Models
{
    public class CreateCustomerRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public Address Address { get; set; } = new Address();
        public DateTime DateOfBirth { get; set; }
        public string DriversLicense { get; set; } = string.Empty;
    }

    public class UpdateCustomerRequest
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public Address? Address { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? DriversLicense { get; set; }
    }
}
