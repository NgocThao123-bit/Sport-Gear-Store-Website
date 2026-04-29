// ============================================================
// FILE: Configurations/CategoryConfiguration.cs
// MỤC ĐÍCH: Cấu hình bảng Categories.
// ============================================================

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Infrastructure.Persistence.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Name).IsRequired().HasMaxLength(100);
        builder.Property(c => c.Slug).IsRequired().HasMaxLength(150);
        builder.Property(c => c.Description).HasMaxLength(500);
        builder.Property(c => c.ImageUrl).HasMaxLength(1000);

        // Slug must be unique — used in URLs
        // Slug phải là duy nhất — dùng trong URLs
        builder.HasIndex(c => c.Slug).IsUnique();

        // Seed initial categories for a sport gear store
        // Seed danh mục ban đầu cho cửa hàng dụng cụ thể thao
        builder.HasData(
            new Category { Id = Guid.Parse("11111111-1111-1111-1111-111111111111"), Name = "Running", Slug = "running", IsActive = true, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Category { Id = Guid.Parse("22222222-2222-2222-2222-222222222222"), Name = "Cycling", Slug = "cycling", IsActive = true, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Category { Id = Guid.Parse("33333333-3333-3333-3333-333333333333"), Name = "Football", Slug = "football", IsActive = true, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Category { Id = Guid.Parse("44444444-4444-4444-4444-444444444444"), Name = "Basketball", Slug = "basketball", IsActive = true, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Category { Id = Guid.Parse("55555555-5555-5555-5555-555555555555"), Name = "Swimming", Slug = "swimming", IsActive = true, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );
    }
}
