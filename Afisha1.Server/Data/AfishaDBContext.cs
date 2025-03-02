using Microsoft.EntityFrameworkCore;
using Afisha1.Server.Models;

namespace Afisha1.Server.Data
{
    public class AfishaDbContext : DbContext
    {
        public AfishaDbContext(DbContextOptions<AfishaDbContext> options) : base(options)
        {
        }

        public DbSet<Place> Places { get; set; } = null!;
        public DbSet<Meeting> Meetings { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Настройка отношений между моделями
            modelBuilder.Entity<Meeting>()
                .HasOne(m => m.Place)
                .WithMany(p => p.Meetings)
                .HasForeignKey(m => m.PlaceId)
                .OnDelete(DeleteBehavior.Restrict);

            // Исправление маппинга для Meetings в Place
            modelBuilder.Entity<Place>()
                .Ignore(p => p.Meetings);

            // Затем настроить коллекцию
            modelBuilder.Entity<Place>()
                .HasMany(p => p.Meetings)
                .WithOne(m => m.Place)
                .HasForeignKey(m => m.PlaceId);
        }
    }
}