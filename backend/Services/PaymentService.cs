using CarRentalAPI.Models;
using MongoDB.Driver;
using Stripe;
using System.Text.Json;

namespace CarRentalAPI.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IMongoCollection<Payment> _payments;
        private readonly IConfiguration _configuration;
        private readonly StripeService _stripeService;
        private readonly PayPalService _payPalService;

        public PaymentService(IMongoClient mongoClient, IConfiguration configuration, PayPalService payPalService)
        {
            var database = mongoClient.GetDatabase("CarRentalDB");
            _payments = database.GetCollection<Payment>("payments");
            _configuration = configuration;
            _stripeService = new StripeService(_configuration);
            _payPalService = payPalService;
        }

        public async Task<List<PaymentResponse>> GetAllPaymentsAsync()
        {
            var payments = await _payments.Find(_ => true).ToListAsync();
            return payments.Select(MapToResponse).ToList();
        }

        public async Task<PaymentResponse> CreatePaymentAsync(PaymentRequest request)
        {
            var payment = new Payment
            {
                BookingId = request.BookingId,
                CustomerId = request.CustomerId,
                Amount = request.Amount,
                Currency = request.Currency,
                PaymentMethod = request.PaymentMethod,
                PaymentProvider = request.PaymentProvider,
                Description = request.Description,
                Status = PaymentStatus.Pending
            };

            await _payments.InsertOneAsync(payment);

            PaymentResponse response;
            if (request.PaymentProvider == PaymentProvider.Stripe)
            {
                response = await ProcessStripePaymentAsync(new StripePaymentIntentRequest
                {
                    BookingId = request.BookingId,
                    CustomerId = request.CustomerId,
                    Amount = request.Amount,
                    Currency = request.Currency,
                    Description = request.Description
                });
            }
            else if (request.PaymentProvider == PaymentProvider.PayPal)
            {
                response = await ProcessPayPalPaymentAsync(new PayPalOrderRequest
                {
                    BookingId = request.BookingId,
                    CustomerId = request.CustomerId,
                    Amount = request.Amount,
                    Currency = request.Currency,
                    Description = request.Description
                });
            }
            else
            {
                throw new ArgumentException("Unsupported payment provider");
            }

            return response;
        }

        public async Task<PaymentResponse> ProcessStripePaymentAsync(StripePaymentIntentRequest request)
        {
            var payment = await _payments.Find(p => p.BookingId == request.BookingId && p.PaymentProvider == PaymentProvider.Stripe)
                .FirstOrDefaultAsync();

            if (payment == null)
            {
                payment = new Payment
                {
                    BookingId = request.BookingId,
                    CustomerId = request.CustomerId,
                    Amount = request.Amount,
                    Currency = request.Currency,
                    PaymentProvider = PaymentProvider.Stripe,
                    Description = request.Description,
                    Status = PaymentStatus.Pending
                };
                await _payments.InsertOneAsync(payment);
            }

            var clientSecret = await _stripeService.CreatePaymentIntentAsync(request.Amount, request.Currency, request.Description);

            return new PaymentResponse
            {
                Id = payment.Id!,
                BookingId = payment.BookingId,
                CustomerId = payment.CustomerId,
                Amount = payment.Amount,
                Currency = payment.Currency,
                PaymentMethod = payment.PaymentMethod,
                PaymentProvider = payment.PaymentProvider,
                TransactionId = payment.TransactionId,
                Status = payment.Status,
                Description = payment.Description,
                CreatedAt = payment.CreatedAt,
                UpdatedAt = payment.UpdatedAt,
                ClientSecret = clientSecret
            };
        }

        public async Task<PaymentResponse> ProcessPayPalPaymentAsync(PayPalOrderRequest request)
        {
            var payment = await _payments.Find(p => p.BookingId == request.BookingId && p.PaymentProvider == PaymentProvider.PayPal)
                .FirstOrDefaultAsync();

            if (payment == null)
            {
                payment = new Payment
                {
                    BookingId = request.BookingId,
                    CustomerId = request.CustomerId,
                    Amount = request.Amount,
                    Currency = request.Currency,
                    PaymentProvider = PaymentProvider.PayPal,
                    Description = request.Description,
                    Status = PaymentStatus.Pending
                };
                await _payments.InsertOneAsync(payment);
            }

            var paymentUrl = await _payPalService.CreateOrderAsync(request.Amount, request.Currency, request.Description);

            return new PaymentResponse
            {
                Id = payment.Id!,
                BookingId = payment.BookingId,
                CustomerId = payment.CustomerId,
                Amount = payment.Amount,
                Currency = payment.Currency,
                PaymentMethod = payment.PaymentMethod,
                PaymentProvider = payment.PaymentProvider,
                TransactionId = payment.TransactionId,
                Status = payment.Status,
                Description = payment.Description,
                CreatedAt = payment.CreatedAt,
                UpdatedAt = payment.UpdatedAt,
                PaymentUrl = paymentUrl
            };
        }

        public async Task<PaymentResponse> GetPaymentAsync(string paymentId)
        {
            var payment = await _payments.Find(p => p.Id == paymentId).FirstOrDefaultAsync();
            if (payment == null) return null!;

            return MapToResponse(payment);
        }

        public async Task<List<PaymentResponse>> GetPaymentsByBookingAsync(string bookingId)
        {
            var payments = await _payments.Find(p => p.BookingId == bookingId).ToListAsync();
            return payments.Select(MapToResponse).ToList();
        }

        public async Task<List<PaymentResponse>> GetPaymentsByCustomerAsync(string customerId)
        {
            var payments = await _payments.Find(p => p.CustomerId == customerId).ToListAsync();
            return payments.Select(MapToResponse).ToList();
        }

        public async Task<PaymentResponse> ConfirmPaymentAsync(string paymentId, string transactionId)
        {
            var update = Builders<Payment>.Update
                .Set(p => p.TransactionId, transactionId)
                .Set(p => p.Status, PaymentStatus.Succeeded)
                .Set(p => p.UpdatedAt, DateTime.UtcNow);

            await _payments.UpdateOneAsync(p => p.Id == paymentId, update);
            return await GetPaymentAsync(paymentId);
        }

        public async Task<bool> RefundPaymentAsync(string paymentId, decimal? amount = null)
        {
            var payment = await _payments.Find(p => p.Id == paymentId).FirstOrDefaultAsync();
            if (payment == null || payment.Status != PaymentStatus.Succeeded) return false;

            try
            {
                bool success = false;
                if (payment.PaymentProvider == PaymentProvider.Stripe)
                {
                    success = await _stripeService.RefundPaymentAsync(payment.TransactionId, amount);
                }
                else if (payment.PaymentProvider == PaymentProvider.PayPal)
                {
                    success = await _payPalService.RefundPaymentAsync(payment.TransactionId, amount);
                }

                if (success)
                {
                    var update = Builders<Payment>.Update
                        .Set(p => p.Status, PaymentStatus.Refunded)
                        .Set(p => p.UpdatedAt, DateTime.UtcNow);

                    await _payments.UpdateOneAsync(p => p.Id == paymentId, update);
                }
                return success;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> CapturePayPalPaymentAsync(string paymentId, string payerId)
        {
            try
            {
                var payment = await _payments.Find(p => p.Id == paymentId).FirstOrDefaultAsync();
                if (payment == null || payment.PaymentProvider != PaymentProvider.PayPal) return false;

                var success = await _payPalService.CaptureOrderAsync(payment.TransactionId, payerId);
                
                if (success)
                {
                    var update = Builders<Payment>.Update
                        .Set(p => p.Status, PaymentStatus.Succeeded)
                        .Set(p => p.UpdatedAt, DateTime.UtcNow);

                    await _payments.UpdateOneAsync(p => p.Id == paymentId, update);
                }
                
                return success;
            }
            catch
            {
                return false;
            }
        }

        public async Task<PaymentResponse> UpdatePaymentStatusAsync(string paymentId, PaymentStatus status)
        {
            var update = Builders<Payment>.Update
                .Set(p => p.Status, status)
                .Set(p => p.UpdatedAt, DateTime.UtcNow);

            await _payments.UpdateOneAsync(p => p.Id == paymentId, update);
            return await GetPaymentAsync(paymentId);
        }

        private static PaymentResponse MapToResponse(Payment payment)
        {
            return new PaymentResponse
            {
                Id = payment.Id!,
                BookingId = payment.BookingId,
                CustomerId = payment.CustomerId,
                Amount = payment.Amount,
                Currency = payment.Currency,
                PaymentMethod = payment.PaymentMethod,
                PaymentProvider = payment.PaymentProvider,
                TransactionId = payment.TransactionId,
                Status = payment.Status,
                Description = payment.Description,
                CreatedAt = payment.CreatedAt,
                UpdatedAt = payment.UpdatedAt
            };
        }
    }
}
