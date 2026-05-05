using ExpenseTracker.Domain;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Persistence.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Configure the Transaction entity if needed (e.g., table name, relationships, etc.)
            modelBuilder.Entity<Transaction>(entity =>
            {
                // Ensures EF knows about the decimal precision for finances
                entity.Property(e => e.UnitPrice)
                      .HasPrecision(18, 2);

                entity.Property(e => e.Total)
                      .HasPrecision(18, 2);
            });
        }
    }
}
