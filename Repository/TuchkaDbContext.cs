using Microsoft.EntityFrameworkCore;
using Tuchka.Entities;

namespace Tuchka.Repository;
public class TuchkaDbContext : DbContext
{
    public TuchkaDbContext(DbContextOptions<TuchkaDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder) 
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Folder>()
            .Property(f => f.ParentId)
            .HasDefaultValue(null);
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Color> Colors { get; set; }
    public DbSet<Entities.File> Files { get; set; }
    public DbSet<FileType> FileType { get; set; }
    public DbSet<Folder> Folders { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
}
