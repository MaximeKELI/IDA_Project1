using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionSalles.Data;
using GestionSalles.Models;

namespace GestionSalles.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CoursController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Cours>>> GetCours()
    {
        return await _context.Cours
            .Include(c => c.Filiere)
            .Include(c => c.Salle)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Cours>> GetCours(int id)
    {
        var cours = await _context.Cours
            .Include(c => c.Filiere)
            .Include(c => c.Salle)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (cours == null)
        {
            return NotFound();
        }

        return cours;
    }

    [HttpGet("filiere/{filiereId}")]
    public async Task<ActionResult<IEnumerable<Cours>>> GetCoursByFiliere(int filiereId)
    {
        return await _context.Cours
            .Include(c => c.Filiere)
            .Include(c => c.Salle)
            .Where(c => c.FiliereId == filiereId)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Cours>> PostCours([FromBody] Cours cours)
    {
        // Vérifier si la filière existe
        var filiere = await _context.Filieres.FindAsync(cours.FiliereId);
        if (filiere == null)
        {
            return BadRequest("Filière invalide");
        }
        cours.Filiere = filiere;

        // Vérifier si la salle existe
        var salle = await _context.Salles.FindAsync(cours.SalleId);
        if (salle == null)
        {
            return BadRequest("Salle invalide");
        }
        cours.Salle = salle;

        // Récupérer tous les cours pour la même salle et le même jour
        var coursExistants = await _context.Cours
            .Where(c => c.SalleId == cours.SalleId && c.Jour == cours.Jour)
            .ToListAsync();

        // Vérifier les conflits d'horaires
        foreach (var c in coursExistants)
        {
            bool conflit = (cours.HeureDebut <= c.HeureDebut && c.HeureDebut < cours.HeureFin) ||
                          (cours.HeureDebut < c.HeureFin && c.HeureFin <= cours.HeureFin) ||
                          (c.HeureDebut <= cours.HeureDebut && cours.HeureFin <= c.HeureFin);

            if (conflit)
            {
                return BadRequest($"Il y a un conflit d'horaire avec le cours '{c.Nom}' ({c.HeureDebut:hh\\:mm} - {c.HeureFin:hh\\:mm})");
            }
        }

        _context.Cours.Add(cours);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCours), new { id = cours.Id }, cours);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutCours(int id, Cours cours)
    {
        if (id != cours.Id)
        {
            return BadRequest();
        }

        // Vérifier si la filière existe
        if (!await _context.Filieres.AnyAsync(f => f.Id == cours.FiliereId))
        {
            return BadRequest("Filière invalide");
        }

        // Vérifier si la salle existe
        if (!await _context.Salles.AnyAsync(s => s.Id == cours.SalleId))
        {
            return BadRequest("Salle invalide");
        }

        // Vérifier les conflits d'horaires (en excluant le cours actuel)
        var conflit = await _context.Cours
            .Where(c => c.Id != id)
            .AnyAsync(c => c.SalleId == cours.SalleId 
                && c.Jour == cours.Jour
                && ((c.HeureDebut <= cours.HeureDebut && cours.HeureDebut < c.HeureFin)
                    || (c.HeureDebut < cours.HeureFin && cours.HeureFin <= c.HeureFin)
                    || (cours.HeureDebut <= c.HeureDebut && c.HeureFin <= cours.HeureFin)));

        if (conflit)
        {
            return BadRequest("Il y a un conflit d'horaire pour cette salle");
        }

        _context.Entry(cours).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CoursExists(id))
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
    public async Task<IActionResult> DeleteCours(int id)
    {
        var cours = await _context.Cours.FindAsync(id);
        if (cours == null)
        {
            return NotFound();
        }

        _context.Cours.Remove(cours);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool CoursExists(int id)
    {
        return _context.Cours.Any(e => e.Id == id);
    }
} 