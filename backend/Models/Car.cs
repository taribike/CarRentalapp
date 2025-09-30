using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CarRentalAPI.Models
{
    public class Car
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("make")]
        public string Make { get; set; } = string.Empty;

        [BsonElement("model")]
        public string Model { get; set; } = string.Empty;

        [BsonElement("year")]
        public int Year { get; set; }

        [BsonElement("color")]
        public string Color { get; set; } = string.Empty;

        [BsonElement("licensePlate")]
        public string LicensePlate { get; set; } = string.Empty;

        [BsonElement("dailyRate")]
        public decimal DailyRate { get; set; }

        [BsonElement("isAvailable")]
        public bool IsAvailable { get; set; } = true;

        [BsonElement("fuelType")]
        public string FuelType { get; set; } = string.Empty;

        [BsonElement("transmission")]
        public string Transmission { get; set; } = string.Empty;

        [BsonElement("seats")]
        public int Seats { get; set; }

        [BsonElement("imageUrl")]
        public string? ImageUrl { get; set; }

        [BsonElement("description")]
        public string? Description { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime? UpdatedAt { get; set; }
    }
}
