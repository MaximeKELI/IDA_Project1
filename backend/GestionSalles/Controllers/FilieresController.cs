using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionSalles.Data;
using GestionSalles.Models;

namespace GestionSalles.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FilieresController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FilieresController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Filiere>>> GetFilieres()
    {
        return await _context.Filieres.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Filiere>> GetFiliere(int id)
    {
        var filiere = await _context.Filieres.FindAsync(id);

        if (filiere == null)
        {
            return NotFound();
        }

        return filiere;
    }

    [HttpPost]
    public async Task<ActionResult<Filiere>> PostFiliere(Filiere filiere)
    {
        _context.Filieres.Add(filiere);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFiliere), new { id = filiere.Id }, filiere);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutFiliere(int id, Filiere filiere)
    {
        if (id != filiere.Id)
        {
            return BadRequest();
        }

        _context.Entry(filiere).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!FiliereExists(id))
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
    public async Task<IActionResult> DeleteFiliere(int id)
    {
        var filiere = await _context.Filieres.FindAsync(id);
        if (filiere == null)
        {
            return NotFound();
        }

        _context.Filieres.Remove(filiere);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool FiliereExists(int id)
    {
        return _context.Filieres.Any(e => e.Id == id);
    }
} 