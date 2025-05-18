using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GestionSalles.Models;

public class Cours
{
    public int Id { get; set; }

    [Required]
    public int FiliereId { get; set; }

    [JsonIgnore]
    public Filiere? Filiere { get; set; }

    [Required]
    public int SalleId { get; set; }

    [JsonIgnore]
    public Salle? Salle { get; set; }

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