// ============================================================
// FILE: Configurations/ProductConfiguration.cs
// MỤC ĐÍCH: Cấu hình bảng Products.
// ============================================================

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Name).IsRequired().HasMaxLength(200);
        builder.Property(p => p.Slug).IsRequired().HasMaxLength(250);
        builder.Property(p => p.Brand).IsRequired().HasMaxLength(100);
        builder.Property(p => p.Description).HasMaxLength(5000);

        // decimal(18,2) = up to 16 digits before decimal, 2 after
        // decimal(18,2) = tối đa 16 chữ số trước dấu thập phân, 2 sau
        builder.Property(p => p.Price).HasColumnType("decimal(18,2)");
        builder.Property(p => p.SalePrice).HasColumnType("decimal(18,2)");

        builder.HasIndex(p => p.Slug).IsUnique();

        // Index on CategoryId speeds up filtering by category
        // Index trên CategoryId tăng tốc lọc theo danh mục
        builder.HasIndex(p => p.CategoryId);

        builder.HasOne(p => p.Category)
               .WithMany(c => c.Products)
               .HasForeignKey(p => p.CategoryId)
               .OnDelete(DeleteBehavior.Restrict); // Don't delete products when category deleted
                                                   // Không xóa sản phẩm khi danh mục bị xóa
    }
}
