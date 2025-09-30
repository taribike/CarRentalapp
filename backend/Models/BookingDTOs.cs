namespace CarRentalAPI.Models
{
    public class CreateBookingRequest
    {
        public string CustomerId { get; set; } = string.Empty;
        public string CarId { get; set; } = string.Empty;
        public DateTime PickupDate { get; set; }
        public DateTime ReturnDate { get; set; }
        public string PickupLocation { get; set; } = string.Empty;
        public string ReturnLocation { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }

    public class UpdateBookingRequest
    {
        public DateTime? PickupDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public BookingStatus? Status { get; set; }
        public string? PickupLocation { get; set; }
        public string? ReturnLocation { get; set; }
        public string? Notes { get; set; }
    }

    public class BookingResponse
    {
        public string Id { get; set; } = string.Empty;
        public string CustomerId { get; set; } = string.Empty;
        public string CarId { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string CarInfo { get; set; } = string.Empty;
        public DateTime PickupDate { get; set; }
        public DateTime ReturnDate { get; set; }
        public int TotalDays { get; set; }
        public decimal DailyRate { get; set; }
        public decimal TotalAmount { get; set; }
        public BookingStatus Status { get; set; }
        public string PickupLocation { get; set; } = string.Empty;
        public string ReturnLocation { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? Notes { get; set; }
    }
}
