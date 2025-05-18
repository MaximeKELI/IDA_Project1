using Microsoft.EntityFrameworkCore;
using GestionSalles.Models;

namespace GestionSalles.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Filiere> Filieres { get; set; } = null!;
    public DbSet<Salle> Salles { get; set; } = null!;
    public DbSet<Cours> Cours { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Filiere>()
            .HasIndex(f => f.Nom)
            .IsUnique();

        modelBuilder.Entity<Salle>()
            .HasIndex(s => s.Nom)
            .IsUnique();
    }
} 