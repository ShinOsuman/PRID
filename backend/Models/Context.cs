using Microsoft.EntityFrameworkCore;
using prid.Models;

namespace prid.Models;

public class Context : DbContext
{
    public Context(DbContextOptions<Context> options)
        : base(options) {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.Pseudo).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => new {u.LastName, u.FirstName}).IsUnique();

        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Pseudo = "ben", Password = "ben", Email = "ben@test.com" },
            new User { Id = 2, Pseudo = "bruno", Password = "bruno", Email = "bruno@test.com" }
        );
    }

    public DbSet<User> Users => Set<User>();
}
