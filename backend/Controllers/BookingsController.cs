using Microsoft.AspNetCore.Mvc;
using CarRentalAPI.Models;
using CarRentalAPI.Services;

namespace CarRentalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpGet]
        public async Task<ActionResult<List<BookingResponse>>> GetAllBookings()
        {
            var bookings = await _bookingService.GetAllBookingsAsync();
            return Ok(bookings);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookingResponse>> GetBooking(string id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            if (booking == null)
                return NotFound();

            return Ok(booking);
        }

        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<List<BookingResponse>>> GetBookingsByCustomer(string customerId)
        {
            var bookings = await _bookingService.GetBookingsByCustomerIdAsync(customerId);
            return Ok(bookings);
        }

        [HttpGet("car/{carId}")]
        public async Task<ActionResult<List<BookingResponse>>> GetBookingsByCar(string carId)
        {
            var bookings = await _bookingService.GetBookingsByCarIdAsync(carId);
            return Ok(bookings);
        }

        [HttpPost]
        public async Task<ActionResult<Booking>> CreateBooking([FromBody] CreateBookingRequest request)
        {
            try
            {
                var booking = await _bookingService.CreateBookingAsync(request);
                return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while creating the booking");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(string id, [FromBody] UpdateBookingRequest request)
        {
            try
            {
                var success = await _bookingService.UpdateBookingAsync(id, request);
                if (!success)
                    return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelBooking(string id)
        {
            var success = await _bookingService.CancelBookingAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(string id)
        {
            var success = await _bookingService.DeleteBookingAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
