using Microsoft.AspNetCore.Mvc;
using CarRentalAPI.Models;
using CarRentalAPI.Services;

namespace CarRentalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet]
        public async Task<ActionResult<List<PaymentResponse>>> GetAllPayments()
        {
            var payments = await _paymentService.GetAllPaymentsAsync();
            return Ok(payments);
        }

        [HttpPost]
        public async Task<ActionResult<PaymentResponse>> CreatePayment([FromBody] PaymentRequest request)
        {
            try
            {
                var payment = await _paymentService.CreatePaymentAsync(request);
                return Ok(payment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentResponse>> GetPayment(string id)
        {
            var payment = await _paymentService.GetPaymentAsync(id);
            if (payment == null)
                return NotFound();

            return Ok(payment);
        }

        [HttpGet("booking/{bookingId}")]
        public async Task<ActionResult<List<PaymentResponse>>> GetPaymentsByBooking(string bookingId)
        {
            var payments = await _paymentService.GetPaymentsByBookingAsync(bookingId);
            return Ok(payments);
        }

        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<List<PaymentResponse>>> GetPaymentsByCustomer(string customerId)
        {
            var payments = await _paymentService.GetPaymentsByCustomerAsync(customerId);
            return Ok(payments);
        }

        [HttpPost("stripe/create-intent")]
        public async Task<ActionResult<PaymentResponse>> CreateStripePaymentIntent([FromBody] StripePaymentIntentRequest request)
        {
            try
            {
                var payment = await _paymentService.ProcessStripePaymentAsync(request);
                return Ok(payment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("stripe/confirm")]
        public async Task<ActionResult<PaymentResponse>> ConfirmStripePayment([FromBody] ConfirmPaymentRequest request)
        {
            try
            {
                var payment = await _paymentService.ConfirmPaymentAsync(request.PaymentId, request.TransactionId);
                return Ok(payment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("paypal/create-order")]
        public async Task<ActionResult<PaymentResponse>> CreatePayPalOrder([FromBody] PayPalOrderRequest request)
        {
            try
            {
                var payment = await _paymentService.ProcessPayPalPaymentAsync(request);
                return Ok(payment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("paypal/capture")]
        public async Task<ActionResult<bool>> CapturePayPalPayment([FromBody] PayPalCaptureRequest request)
        {
            try
            {
                var success = await _paymentService.CapturePayPalPaymentAsync(request.PaymentId, request.PayerId);
                return Ok(success);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/refund")]
        public async Task<ActionResult<bool>> RefundPayment(string id, [FromBody] RefundRequest? refundRequest = null)
        {
            try
            {
                var success = await _paymentService.RefundPaymentAsync(id, refundRequest?.Amount);
                return Ok(success);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}/status")]
        public async Task<ActionResult<PaymentResponse>> UpdatePaymentStatus(string id, [FromBody] UpdatePaymentStatusRequest request)
        {
            try
            {
                var payment = await _paymentService.UpdatePaymentStatusAsync(id, request.Status);
                return Ok(payment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public class ConfirmPaymentRequest
    {
        public string PaymentId { get; set; } = string.Empty;
        public string TransactionId { get; set; } = string.Empty;
    }

    public class RefundRequest
    {
        public decimal? Amount { get; set; }
    }

    public class UpdatePaymentStatusRequest
    {
        public PaymentStatus Status { get; set; }
    }

    public class PayPalCaptureRequest
    {
        public string PaymentId { get; set; } = string.Empty;
        public string PayerId { get; set; } = string.Empty;
    }
}
