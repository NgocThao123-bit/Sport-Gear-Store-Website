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
               .OnDelete(DeleteBehavior.Restrict);

        // ── Seed Data ────────────────────────────────────────────
        // 9 products: 3 per category (Clothing / Footwear / Equipment)
        // 9 sản phẩm: 3 mỗi danh mục
        var seed = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        var catClothing  = Guid.Parse("aaaa0001-0000-0000-0000-000000000000");
        var catFootwear  = Guid.Parse("aaaa0002-0000-0000-0000-000000000000");
        var catEquipment = Guid.Parse("aaaa0003-0000-0000-0000-000000000000");

        builder.HasData(
            // ── CLOTHING ─────────────────────────────────────────
            new Product
            {
                Id = Guid.Parse("bbbb0001-0000-0000-0000-000000000000"),
                Name = "Nike Dri-FIT Training T-Shirt",
                Slug = "nike-dri-fit-training-tshirt",
                Brand = "Nike",
                Description = "Lightweight, sweat-wicking Dri-FIT fabric keeps you dry and comfortable during intense training sessions.",
                Price = 29.99m, SalePrice = null,
                IsActive = true, CategoryId = catClothing, CreatedAt = seed
            },
            new Product
            {
                Id = Guid.Parse("bbbb0002-0000-0000-0000-000000000000"),
                Name = "Adidas Essentials 3-Stripes Shorts",
                Slug = "adidas-essentials-3-stripes-shorts",
                Brand = "Adidas",
                Description = "Classic Adidas shorts with iconic 3-stripes design. Elastic waistband with drawcord for a secure fit.",
                Price = 34.99m, SalePrice = 27.99m,
                IsActive = true, CategoryId = catClothing, CreatedAt = seed
            },
            new Product
            {
                Id = Guid.Parse("bbbb0003-0000-0000-0000-000000000000"),
                Name = "Under Armour ColdGear Running Jacket",
                Slug = "under-armour-coldgear-running-jacket",
                Brand = "Under Armour",
                Description = "ColdGear technology traps heat without bulk. Reflective details for low-light visibility. Zip pockets for secure storage.",
                Price = 89.99m, SalePrice = null,
                IsActive = true, CategoryId = catClothing, CreatedAt = seed
            },

            // ── FOOTWEAR ──────────────────────────────────────────
            new Product
            {
                Id = Guid.Parse("bbbb0004-0000-0000-0000-000000000000"),
                Name = "Nike Air Zoom Pegasus 40",
                Slug = "nike-air-zoom-pegasus-40",
                Brand = "Nike",
                Description = "The iconic running shoe is back. Air Zoom unit delivers a springy, responsive ride on every run.",
                Price = 130.00m, SalePrice = null,
                IsActive = true, CategoryId = catFootwear, CreatedAt = seed
            },
            new Product
            {
                Id = Guid.Parse("bbbb0005-0000-0000-0000-000000000000"),
                Name = "Adidas Predator Accuracy Football Boots",
                Slug = "adidas-predator-accuracy-football-boots",
                Brand = "Adidas",
                Description = "Control-zone texture on the upper increases friction on the ball for precise passing and devastating shots.",
                Price = 159.99m, SalePrice = 129.99m,
                IsActive = true, CategoryId = catFootwear, CreatedAt = seed
            },
            new Product
            {
                Id = Guid.Parse("bbbb0006-0000-0000-0000-000000000000"),
                Name = "Asics Gel-Nimbus 25 Running Shoes",
                Slug = "asics-gel-nimbus-25-running-shoes",
                Brand = "Asics",
                Description = "Maximum cushioning with GEL technology for long-distance runs. FF BLAST PLUS ECO midsole provides a soft, responsive bounce.",
                Price = 149.99m, SalePrice = null,
                IsActive = true, CategoryId = catFootwear, CreatedAt = seed
            },

            // ── EQUIPMENT ─────────────────────────────────────────
            new Product
            {
                Id = Guid.Parse("bbbb0007-0000-0000-0000-000000000000"),
                Name = "Nike Strike Football",
                Slug = "nike-strike-football",
                Brand = "Nike",
                Description = "High-visibility design with a textured casing for better grip and ball control in all conditions.",
                Price = 34.99m, SalePrice = null,
                IsActive = true, CategoryId = catEquipment, CreatedAt = seed
            },
            new Product
            {
                Id = Guid.Parse("bbbb0008-0000-0000-0000-000000000000"),
                Name = "Spalding NBA Official Game Basketball",
                Slug = "spalding-nba-official-game-basketball",
                Brand = "Spalding",
                Description = "Official NBA game ball. Full-grain leather construction for superior feel and control.",
                Price = 179.99m, SalePrice = 149.99m,
                IsActive = true, CategoryId = catEquipment, CreatedAt = seed
            },
            new Product
            {
                Id = Guid.Parse("bbbb0009-0000-0000-0000-000000000000"),
                Name = "Yonex Astrox 88S Badminton Racket",
                Slug = "yonex-astrox-88s-badminton-racket",
                Brand = "Yonex",
                Description = "Rotational Generator System for steep angle attacking shots. Nanomesh Neo + Carbon Nanotube construction.",
                Price = 199.99m, SalePrice = null,
                IsActive = true, CategoryId = catEquipment, CreatedAt = seed
            }
        );
    }
}
