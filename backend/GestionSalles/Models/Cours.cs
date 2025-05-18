using System.ComponentModel.DataAnnotations;

namespace GestionSalles.Models;

public class Cours
{
    public int Id { get; set; }

    [Required]
    public int FiliereId { get; set; }
    public Filiere Filiere { get; set; } = null!;

    [Required]
    public int SalleId { get; set; }
    public Salle Salle { get; set; } = null!;

    [Required]
    [StringLength(100)]
    public string Nom { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Professeur { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string Jour { get; set; } = string.Empty;

    [Required]
    public TimeSpan HeureDebut { get; set; }

    [Required]
    public TimeSpan HeureFin { get; set; }
} 