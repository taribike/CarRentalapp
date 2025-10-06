using CarRentalAPI.Models;

namespace CarRentalAPI.Services
{
    public interface IPaymentService
    {
        Task<List<PaymentResponse>> GetAllPaymentsAsync();
        Task<PaymentResponse> CreatePaymentAsync(PaymentRequest request);
        Task<PaymentResponse> GetPaymentAsync(string paymentId);
        Task<List<PaymentResponse>> GetPaymentsByBookingAsync(string bookingId);
        Task<List<PaymentResponse>> GetPaymentsByCustomerAsync(string customerId);
        Task<PaymentResponse> ProcessStripePaymentAsync(StripePaymentIntentRequest request);
        Task<PaymentResponse> ProcessPayPalPaymentAsync(PayPalOrderRequest request);
        Task<PaymentResponse> ConfirmPaymentAsync(string paymentId, string transactionId);
        Task<bool> CapturePayPalPaymentAsync(string paymentId, string payerId);
        Task<bool> RefundPaymentAsync(string paymentId, decimal? amount = null);
        Task<PaymentResponse> UpdatePaymentStatusAsync(string paymentId, PaymentStatus status);
    }
}
