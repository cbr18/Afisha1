using Microsoft.AspNetCore.Mvc;
using Afisha1.Server.Data;
using Afisha1.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Afisha1.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MeetingsController : ControllerBase
{
    private readonly ILogger<MeetingsController> _logger;
    private readonly AfishaDbContext _context;

    public MeetingsController(ILogger<MeetingsController> logger, AfishaDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    // GET: api/meetings
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MeetingResponseDto>>> GetMeetings(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page < 1 || pageSize < 1)
        {
            return BadRequest(new { error = "Page and pageSize must be positive integers" });
        }

        _logger.LogInformation("Getting meetings for page {Page} with pageSize {PageSize}", page, pageSize);

        int totalCount = await _context.Meetings.CountAsync();

        var meetings = await _context.Meetings
            .Include(m => m.Place)
            .OrderBy(m => m.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var responseItems = meetings.Select(m => new MeetingResponseDto
        {
            Id = m.Id,
            Name = m.Name,
            Description = m.Description,
            Date = m.Date,
            PlaceId = m.PlaceId,
            Place = m.Place != null ? new PlaceDto
            {
                Id = m.Place.Id,
                Name = m.Place.Name,
                Description = m.Place.Description
            } : null
        }).ToList();

        return Ok(new { data = responseItems, total = totalCount });
    }

    // GET: api/meetings/id
    [HttpGet("{id}")]
    public async Task<ActionResult<MeetingResponseDto>> GetMeeting(int id)
    {
        var meeting = await _context.Meetings
            .Include(m => m.Place)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (meeting == null)
        {
            _logger.LogInformation("Meeting not found");
            return NotFound();
        }

        _logger.LogInformation("Meeting found");

        var response = new MeetingResponseDto
        {
            Id = meeting.Id,
            Name = meeting.Name,
            Description = meeting.Description,
            Date = meeting.Date,
            PlaceId = meeting.PlaceId,
            Place = meeting.Place != null ? new PlaceDto
            {
                Id = meeting.Place.Id,
                Name = meeting.Place.Name,
                Description = meeting.Place.Description
            } : null
        };

        return response;
    }

    // POST: api/meetings
    [HttpPost]
    public async Task<ActionResult<MeetingResponseDto>> CreateMeeting(MeetingDto meetingDto)
    {
        if (meetingDto == null)
        {
            return BadRequest();
        }

        var place = await _context.Places.FindAsync(meetingDto.PlaceId);
        if (place == null)
        {
            return BadRequest(new { errors = new { PlaceId = new[] { "Place not  found" } } });
        }

        var meeting = new Meeting
        {
            Name = meetingDto.Name,
            Description = meetingDto.Description,
            Date = meetingDto.Date,
            PlaceId = meetingDto.PlaceId
        };

        _context.Meetings.Add(meeting);
        await _context.SaveChangesAsync();
        await _context.Entry(meeting).Reference(m => m.Place).LoadAsync();

        var response = new MeetingResponseDto
        {
            Id = meeting.Id,
            Name = meeting.Name,
            Description = meeting.Description,
            Date = meeting.Date,
            PlaceId = meeting.PlaceId,
            Place = meeting.Place != null ? new PlaceDto
            {
                Id = meeting.Place.Id,
                Name = meeting.Place.Name,
                Description = meeting.Place.Description
            } : null
        };

        _logger.LogInformation("Meeting created");
        return CreatedAtAction(nameof(GetMeeting), new { id = meeting.Id }, response);
    }

    // PUT: api/meetings/id
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMeeting(int id, MeetingDto meetingDto)
    {
        if (id != meetingDto.Id)
        {
            return BadRequest();
        }

        var place = await _context.Places.FindAsync(meetingDto.PlaceId);
        if (place == null)
        {
            return BadRequest(new { errors = new { PlaceId = new[] { "Place not  found" } } });
        }

        var meeting = await _context.Meetings.FindAsync(id);
        if (meeting == null)
        {
            return NotFound();
        }

        meeting.Name = meetingDto.Name;
        meeting.Description = meetingDto.Description;
        meeting.Date = meetingDto.Date;
        meeting.PlaceId = meetingDto.PlaceId;

        _context.Entry(meeting).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MeetingExists(id))
            {
                return NotFound();
            }
            throw;
        }

        _logger.LogInformation("Meeting updated");
        return NoContent();
    }

    // DELETE: api/meetings/id
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMeeting(int id)
    {
        var meeting = await _context.Meetings.FindAsync(id);
        if (meeting == null)
        {
            return NotFound();
        }

        _context.Meetings.Remove(meeting);
        await _context.SaveChangesAsync();
        _logger.LogInformation("Meeting deleted");
        return NoContent();
    }

    private bool MeetingExists(int id)
    {
        return _context.Meetings.Any(e => e.Id == id);
    }
}