namespace CarRentalAPI.Models
{
    public class CreateCarRequest
    {
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int Year { get; set; }
        public string Color { get; set; } = string.Empty;
        public string LicensePlate { get; set; } = string.Empty;
        public decimal DailyRate { get; set; }
        public string FuelType { get; set; } = string.Empty;
        public string Transmission { get; set; } = string.Empty;
        public int Seats { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
    }

    public class UpdateCarRequest
    {
        public string? Make { get; set; }
        public string? Model { get; set; }
        public int? Year { get; set; }
        public string? Color { get; set; }
        public string? LicensePlate { get; set; }
        public decimal? DailyRate { get; set; }
        public bool? IsAvailable { get; set; }
        public string? FuelType { get; set; }
        public string? Transmission { get; set; }
        public int? Seats { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
    }

    public class CarSearchRequest
    {
        public string? Make { get; set; }
        public string? Model { get; set; }
        public int? MinYear { get; set; }
        public int? MaxYear { get; set; }
        public decimal? MaxDailyRate { get; set; }
        public string? FuelType { get; set; }
        public string? Transmission { get; set; }
        public int? MinSeats { get; set; }
        public bool? IsAvailable { get; set; }
        public DateTime? AvailableFrom { get; set; }
        public DateTime? AvailableTo { get; set; }
    }
}
