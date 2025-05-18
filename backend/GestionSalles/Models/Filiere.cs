using System.ComponentModel.DataAnnotations;

namespace GestionSalles.Models;

public class Filiere
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Nom { get; set; } = string.Empty;

    public ICollection<Cours> Cours { get; set; } = new List<Cours>();
} 