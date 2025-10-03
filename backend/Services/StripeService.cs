using Stripe;

namespace CarRentalAPI.Services
{
    public class StripeService
    {
        private readonly string _secretKey;
        private readonly string _publishableKey;

        public StripeService(IConfiguration configuration)
        {
            _secretKey = configuration["Stripe:SecretKey"] ?? throw new ArgumentNullException("Stripe:SecretKey");
            _publishableKey = configuration["Stripe:PublishableKey"] ?? throw new ArgumentNullException("Stripe:PublishableKey");
            
            StripeConfiguration.ApiKey = _secretKey;
        }

        public async Task<string> CreatePaymentIntentAsync(decimal amount, string currency, string description)
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

        public async Task<bool> ConfirmPaymentIntentAsync(string paymentIntentId)
        {
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
