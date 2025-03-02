using Microsoft.AspNetCore.Mvc;
using Afisha1.Server.Data;
using Afisha1.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Afisha1.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlacesController : ControllerBase
{
    private readonly ILogger<PlacesController> _logger;
    private readonly AfishaDbContext _context;

    public PlacesController(ILogger<PlacesController> logger, AfishaDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    // GET: api/places
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Place>>> GetPlaces([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        if (page < 1 || pageSize < 1)
        {
            return BadRequest(new { error = "Page and pageSize must be positive integers" });
        }

        int totalCount = await _context.Places.CountAsync();
        var places = await _context.Places
            .OrderBy(p => p.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        _logger.LogInformation("Returning page {Page} with {PageSize} places", page, pageSize);
        return Ok(new { data = places, total = totalCount });
    }

    // GET: api/places/id
    [HttpGet("{id}")]
    public async Task<ActionResult<Place>> GetPlace(int id)
    {
        var place = await _context.Places.FindAsync(id);
        if (place == null)
        {
            _logger.LogInformation("Place not found");
            return NotFound();
        }
        _logger.LogInformation("Place found");
        return place;
    }

    // POST: api/places
    [HttpPost]
    public async Task<ActionResult<Place>> CreatePlace(Place place)
    {
        if (place == null)
        {
            return BadRequest();
        }

        place.Meetings = null;
        _context.Places.Add(place);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Place created");
        return CreatedAtAction(nameof(GetPlace), new { id = place.Id }, place);
    }

    // PUT: api/places/id
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePlace(int id, Place place)
    {
        if (id != place.Id)
        {
            return BadRequest();
        }

        var existingPlace = await _context.Places.FindAsync(id);
        if (existingPlace == null)
        {
            return NotFound();
        }

        existingPlace.Name = place.Name;
        existingPlace.Description = place.Description;
        _context.Entry(existingPlace).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PlaceExists(id))
            {
                return NotFound();
            }
            throw;
        }

        _logger.LogInformation("Place updated");
        return NoContent();
    }

    // DELETE: api/places/id
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlace(int id)
    {
        var place = await _context.Places.FindAsync(id);
        if (place == null)
        {
            return NotFound();
        }

        bool hasRelatedMeetings = await _context.Meetings.AnyAsync(m => m.PlaceId == id);
        if (hasRelatedMeetings)
        {
            return BadRequest(new { error = "Is's used ForeignKey" });
        }

        _context.Places.Remove(place);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Place deleted");
        return NoContent();
    }

    private bool PlaceExists(int id)
    {
        return _context.Places.Any(e => e.Id == id);
    }
}
