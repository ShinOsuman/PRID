using Microsoft.EntityFrameworkCore;
using prid.Models;
using System;

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
            new User { Id = 1, Pseudo = "ben", Password = "ben", Email = "ben@test.com", BirthDate=new DateTime(1970, 1, 2) },
            new User { Id = 2, Pseudo = "bruno", Password = "bruno", Email = "bruno@test.com", BirthDate=new DateTime(1971, 2, 3) }
        );
    }

    public DbSet<User> Users => Set<User>();
}
