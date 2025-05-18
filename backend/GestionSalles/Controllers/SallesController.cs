using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionSalles.Data;
using GestionSalles.Models;

namespace GestionSalles.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SallesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SallesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Salle>>> GetSalles()
    {
        return await _context.Salles.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Salle>> GetSalle(int id)
    {
        var salle = await _context.Salles.FindAsync(id);

        if (salle == null)
        {
            return NotFound();
        }

        return salle;
    }

    [HttpPost]
    public async Task<ActionResult<Salle>> PostSalle(Salle salle)
    {
        _context.Salles.Add(salle);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSalle), new { id = salle.Id }, salle);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutSalle(int id, Salle salle)
    {
        if (id != salle.Id)
        {
            return BadRequest();
        }

        _context.Entry(salle).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!SalleExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSalle(int id)
    {
        var salle = await _context.Salles.FindAsync(id);
        if (salle == null)
        {
            return NotFound();
        }

        _context.Salles.Remove(salle);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool SalleExists(int id)
    {
        return _context.Salles.Any(e => e.Id == id);
    }
} 