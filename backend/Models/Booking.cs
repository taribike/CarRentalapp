using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CarRentalAPI.Models
{
    public class Booking
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("customerId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string CustomerId { get; set; } = string.Empty;

        [BsonElement("carId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string CarId { get; set; } = string.Empty;

        [BsonElement("pickupDate")]
        public DateTime PickupDate { get; set; }

        [BsonElement("returnDate")]
        public DateTime ReturnDate { get; set; }

        [BsonElement("totalDays")]
        public int TotalDays { get; set; }

        [BsonElement("dailyRate")]
        public decimal DailyRate { get; set; }

        [BsonElement("totalAmount")]
        public decimal TotalAmount { get; set; }

        [BsonElement("status")]
        public BookingStatus Status { get; set; } = BookingStatus.Pending;

        [BsonElement("pickupLocation")]
        public string PickupLocation { get; set; } = string.Empty;

        [BsonElement("returnLocation")]
        public string ReturnLocation { get; set; } = string.Empty;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("notes")]
        public string? Notes { get; set; }
    }

    public enum BookingStatus
    {
        Pending,
        Confirmed,
        Active,
        Completed,
        Cancelled
    }
}
