using Microsoft.EntityFrameworkCore;
using prid.Models;
using System;

namespace prid.Models;

public class Context : DbContext
{
    private SeedData SeedData { get; set; }
    public Context(DbContextOptions<Context> options)
        : base(options) {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.Pseudo).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => new {u.LastName, u.FirstName}).IsUnique();

        SeedData = new SeedData(modelBuilder);
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Answer> Answers => Set<Answer>();
    public DbSet<Attempt> Attempts => Set<Attempt>();
    public DbSet<Database> Databases => Set<Database>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<Quiz> Quizzes => Set<Quiz>();
    public DbSet<Solution> Solutions => Set<Solution>();


}
