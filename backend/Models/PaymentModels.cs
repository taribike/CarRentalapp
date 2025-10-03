using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CarRentalAPI.Models
{
    public class Payment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("bookingId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string BookingId { get; set; } = string.Empty;

        [BsonElement("customerId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string CustomerId { get; set; } = string.Empty;

        [BsonElement("amount")]
        public decimal Amount { get; set; }

        [BsonElement("currency")]
        public string Currency { get; set; } = "USD";

        [BsonElement("paymentMethod")]
        public PaymentMethod PaymentMethod { get; set; }

        [BsonElement("paymentProvider")]
        public PaymentProvider PaymentProvider { get; set; }

        [BsonElement("transactionId")]
        public string TransactionId { get; set; } = string.Empty;

        [BsonElement("status")]
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        [BsonElement("description")]
        public string Description { get; set; } = string.Empty;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("metadata")]
        public Dictionary<string, string> Metadata { get; set; } = new();
    }

    public class PaymentRequest
    {
        public string BookingId { get; set; } = string.Empty;
        public string CustomerId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public PaymentMethod PaymentMethod { get; set; }
        public PaymentProvider PaymentProvider { get; set; }
        public string Description { get; set; } = string.Empty;
    }

    public class PaymentResponse
    {
        public string Id { get; set; } = string.Empty;
        public string BookingId { get; set; } = string.Empty;
        public string CustomerId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public PaymentMethod PaymentMethod { get; set; }
        public PaymentProvider PaymentProvider { get; set; }
        public string TransactionId { get; set; } = string.Empty;
        public PaymentStatus Status { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? ClientSecret { get; set; } // For Stripe
        public string? PaymentUrl { get; set; } // For PayPal
    }

    public class StripePaymentIntentRequest
    {
        public string BookingId { get; set; } = string.Empty;
        public string CustomerId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public string Description { get; set; } = string.Empty;
    }

    public class PayPalOrderRequest
    {
        public string BookingId { get; set; } = string.Empty;
        public string CustomerId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public string Description { get; set; } = string.Empty;
    }

    public enum PaymentMethod
    {
        CreditCard,
        DebitCard,
        PayPal,
        BankTransfer
    }

    public enum PaymentProvider
    {
        Stripe,
        PayPal
    }

    public enum PaymentStatus
    {
        Pending,
        Processing,
        Succeeded,
        Failed,
        Cancelled,
        Refunded
    }
}
