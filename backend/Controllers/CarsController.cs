using Microsoft.AspNetCore.Mvc;
using CarRentalAPI.Models;
using CarRentalAPI.Services;

namespace CarRentalAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarsController : ControllerBase
    {
        private readonly ICarService _carService;

        public CarsController(ICarService carService)
        {
            _carService = carService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Car>>> GetAllCars()
        {
            var cars = await _carService.GetAllCarsAsync();
            return Ok(cars);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Car>> GetCar(string id)
        {
            var car = await _carService.GetCarByIdAsync(id);
            if (car == null)
                return NotFound();

            return Ok(car);
        }

        [HttpPost("search")]
        public async Task<ActionResult<List<Car>>> SearchCars([FromBody] CarSearchRequest searchRequest)
        {
            var cars = await _carService.SearchCarsAsync(searchRequest);
            return Ok(cars);
        }

        [HttpPost]
        public async Task<ActionResult<Car>> CreateCar([FromBody] CreateCarRequest request)
        {
            try
            {
                var car = await _carService.CreateCarAsync(request);
                return CreatedAtAction(nameof(GetCar), new { id = car.Id }, car);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCar(string id, [FromBody] UpdateCarRequest request)
        {
            try
            {
                var success = await _carService.UpdateCarAsync(id, request);
                if (!success)
                    return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(string id)
        {
            var success = await _carService.DeleteCarAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }

        [HttpGet("{id}/availability")]
        public async Task<ActionResult<bool>> CheckAvailability(string id, [FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var isAvailable = await _carService.IsCarAvailableAsync(id, from, to);
            return Ok(isAvailable);
        }
    }
}
