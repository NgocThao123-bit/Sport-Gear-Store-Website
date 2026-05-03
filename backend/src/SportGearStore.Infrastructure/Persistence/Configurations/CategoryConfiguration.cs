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

        // 3 top-level categories matching the frontend CATEGORIES array
        // 3 danh mục cấp cao khớp với mảng CATEGORIES ở frontend
        builder.HasData(
            new Category
            {
                Id = Guid.Parse("aaaa0001-0000-0000-0000-000000000000"),
                Name = "Clothing", Slug = "clothing",
                Description = "Sports apparel — jerseys, shorts, jackets and compression wear.",
                IsActive = true, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Category
            {
                Id = Guid.Parse("aaaa0002-0000-0000-0000-000000000000"),
                Name = "Footwear", Slug = "footwear",
                Description = "Sports shoes for running, football, basketball, tennis and more.",
                IsActive = true, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Category
            {
                Id = Guid.Parse("aaaa0003-0000-0000-0000-000000000000"),
                Name = "Equipment", Slug = "equipment",
                Description = "Sports equipment — balls, rackets, nets and protective gear.",
                IsActive = true, CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
