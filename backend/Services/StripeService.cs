using Stripe;

namespace CarRentalAPI.Services
{
    public class StripeService
    {
        private readonly string _secretKey;
        private readonly string _publishableKey;
        private readonly bool _testMode;
        private readonly bool _allowMockPayments;

        public StripeService(IConfiguration configuration)
        {
            _secretKey = configuration["Stripe:SecretKey"] ?? "sk_test_placeholder";
            _publishableKey = configuration["Stripe:PublishableKey"] ?? "pk_test_placeholder";
            _testMode = configuration.GetValue<bool>("Payment:TestMode", true);
            _allowMockPayments = configuration.GetValue<bool>("Payment:AllowMockPayments", true);
            
            // Only set Stripe API key if we have real keys
            if (!IsPlaceholderKey(_secretKey))
            {
                StripeConfiguration.ApiKey = _secretKey;
            }
        }

        private bool IsPlaceholderKey(string key)
        {
            return key.Contains("placeholder") || 
                   key.Contains("your_") || 
                   key.Contains("_here") ||
                   key == "sk_test_placeholder" ||
                   key == "pk_test_placeholder";
        }

        private bool IsTestModeEnabled()
        {
            return _testMode && _allowMockPayments;
        }

        public async Task<string> CreatePaymentIntentAsync(decimal amount, string currency, string description)
        {
            // If in test mode with placeholder keys, return a mock client secret
            if (IsTestModeEnabled() && IsPlaceholderKey(_secretKey))
            {
                var mockSecret = $"pi_mock_{Guid.NewGuid().ToString("N").Substring(0, 24)}_secret_{Guid.NewGuid().ToString("N").Substring(0, 24)}";
                return await Task.FromResult(mockSecret);
            }

            try
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = (long)(amount * 100), // Convert to cents
                    Currency = currency.ToLower(),
                    Description = description,
                    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                    {
                        Enabled = true,
                    },
                };

                var service = new PaymentIntentService();
                var paymentIntent = await service.CreateAsync(options);

                return paymentIntent.ClientSecret;
            }
            catch (StripeException ex)
            {
                throw new Exception($"Stripe API Error: {ex.Message}. Please configure valid Stripe API keys or enable test mode in appsettings.", ex);
            }
        }

        public async Task<bool> ConfirmPaymentIntentAsync(string paymentIntentId)
        {
            // If in test mode with mock payment intent, always return success
            if (IsTestModeEnabled() && paymentIntentId.StartsWith("pi_mock_"))
            {
                return await Task.FromResult(true);
            }

            try
            {
                var service = new PaymentIntentService();
                var paymentIntent = await service.GetAsync(paymentIntentId);
                
                return paymentIntent.Status == "succeeded";
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> RefundPaymentAsync(string paymentIntentId, decimal? amount = null)
        {
            // If in test mode with mock payment intent, always return success
            if (IsTestModeEnabled() && paymentIntentId.StartsWith("pi_mock_"))
            {
                return await Task.FromResult(true);
            }

            try
            {
                var options = new RefundCreateOptions
                {
                    PaymentIntent = paymentIntentId,
                };

                if (amount.HasValue)
                {
                    options.Amount = (long)(amount.Value * 100); // Convert to cents
                }

                var service = new RefundService();
                await service.CreateAsync(options);
                
                return true;
            }
            catch
            {
                return false;
            }
        }

        public string GetPublishableKey()
        {
            return _publishableKey;
        }
    }
}
