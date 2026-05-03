using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Infrastructure.Persistence.Configurations;

public class ProductVariantConfiguration : IEntityTypeConfiguration<ProductVariant>
{
    public void Configure(EntityTypeBuilder<ProductVariant> builder)
    {
        builder.HasKey(v => v.Id);
        builder.Property(v => v.Size).HasMaxLength(20);
        builder.Property(v => v.Color).HasMaxLength(50);
        builder.Property(v => v.ExtraPrice).HasColumnType("decimal(18,2)");

        builder.HasOne(v => v.Product)
               .WithMany(p => p.Variants)
               .HasForeignKey(v => v.ProductId)
               .OnDelete(DeleteBehavior.Cascade);

        // ── Seed variants ─────────────────────────────────────────
        // Clothing  → S / M / L / XL  (Black & White)
        // Footwear  → EU 39–44
        // Equipment → product-specific options
        var seed = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        builder.HasData(

            // ── Nike Dri-FIT T-Shirt (bbbb0001) ─────────────────
            new ProductVariant { Id = Guid.Parse("dddd0001-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0001-0000-0000-0000-000000000000"), Size = "S",  Color = "Black", Stock = 20, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0002-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0001-0000-0000-0000-000000000000"), Size = "M",  Color = "Black", Stock = 35, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0003-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0001-0000-0000-0000-000000000000"), Size = "L",  Color = "Black", Stock = 30, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0004-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0001-0000-0000-0000-000000000000"), Size = "XL", Color = "Black", Stock = 15, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0005-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0001-0000-0000-0000-000000000000"), Size = "M",  Color = "White", Stock = 25, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0006-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0001-0000-0000-0000-000000000000"), Size = "L",  Color = "White", Stock = 20, ExtraPrice = 0, CreatedAt = seed },

            // ── Adidas Shorts (bbbb0002) ─────────────────────────
            new ProductVariant { Id = Guid.Parse("dddd0007-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0002-0000-0000-0000-000000000000"), Size = "S",  Color = "Black", Stock = 18, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0008-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0002-0000-0000-0000-000000000000"), Size = "M",  Color = "Black", Stock = 30, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0009-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0002-0000-0000-0000-000000000000"), Size = "L",  Color = "Black", Stock = 25, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0010-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0002-0000-0000-0000-000000000000"), Size = "XL", Color = "Black", Stock = 12, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0011-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0002-0000-0000-0000-000000000000"), Size = "M",  Color = "Navy",  Stock = 20, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0012-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0002-0000-0000-0000-000000000000"), Size = "L",  Color = "Navy",  Stock = 18, ExtraPrice = 0, CreatedAt = seed },

            // ── UA ColdGear Jacket (bbbb0003) ────────────────────
            new ProductVariant { Id = Guid.Parse("dddd0013-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0003-0000-0000-0000-000000000000"), Size = "S",  Color = "Black", Stock = 10, ExtraPrice = 0,    CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0014-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0003-0000-0000-0000-000000000000"), Size = "M",  Color = "Black", Stock = 20, ExtraPrice = 0,    CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0015-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0003-0000-0000-0000-000000000000"), Size = "L",  Color = "Black", Stock = 18, ExtraPrice = 0,    CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0016-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0003-0000-0000-0000-000000000000"), Size = "XL", Color = "Black", Stock = 8,  ExtraPrice = 5.00m, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0017-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0003-0000-0000-0000-000000000000"), Size = "M",  Color = "Red",   Stock = 12, ExtraPrice = 0,    CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0018-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0003-0000-0000-0000-000000000000"), Size = "L",  Color = "Red",   Stock = 10, ExtraPrice = 0,    CreatedAt = seed },

            // ── Nike Air Zoom Pegasus 40 (bbbb0004) ──────────────
            new ProductVariant { Id = Guid.Parse("dddd0019-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0004-0000-0000-0000-000000000000"), Size = "39", Color = "White/Black", Stock = 8,  ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0020-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0004-0000-0000-0000-000000000000"), Size = "40", Color = "White/Black", Stock = 15, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0021-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0004-0000-0000-0000-000000000000"), Size = "41", Color = "White/Black", Stock = 20, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0022-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0004-0000-0000-0000-000000000000"), Size = "42", Color = "White/Black", Stock = 18, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0023-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0004-0000-0000-0000-000000000000"), Size = "43", Color = "White/Black", Stock = 12, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0024-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0004-0000-0000-0000-000000000000"), Size = "44", Color = "White/Black", Stock = 6,  ExtraPrice = 0, CreatedAt = seed },

            // ── Adidas Predator Boots (bbbb0005) ─────────────────
            new ProductVariant { Id = Guid.Parse("dddd0025-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0005-0000-0000-0000-000000000000"), Size = "39", Color = "Black/Red", Stock = 6,  ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0026-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0005-0000-0000-0000-000000000000"), Size = "40", Color = "Black/Red", Stock = 10, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0027-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0005-0000-0000-0000-000000000000"), Size = "41", Color = "Black/Red", Stock = 14, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0028-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0005-0000-0000-0000-000000000000"), Size = "42", Color = "Black/Red", Stock = 16, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0029-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0005-0000-0000-0000-000000000000"), Size = "43", Color = "Black/Red", Stock = 10, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0030-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0005-0000-0000-0000-000000000000"), Size = "44", Color = "Black/Red", Stock = 5,  ExtraPrice = 0, CreatedAt = seed },

            // ── Asics Gel-Nimbus 25 (bbbb0006) ───────────────────
            new ProductVariant { Id = Guid.Parse("dddd0031-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0006-0000-0000-0000-000000000000"), Size = "39", Color = "Blue/Silver", Stock = 7,  ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0032-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0006-0000-0000-0000-000000000000"), Size = "40", Color = "Blue/Silver", Stock = 12, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0033-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0006-0000-0000-0000-000000000000"), Size = "41", Color = "Blue/Silver", Stock = 18, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0034-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0006-0000-0000-0000-000000000000"), Size = "42", Color = "Blue/Silver", Stock = 15, ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0035-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0006-0000-0000-0000-000000000000"), Size = "43", Color = "Blue/Silver", Stock = 9,  ExtraPrice = 0, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0036-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0006-0000-0000-0000-000000000000"), Size = "44", Color = "Blue/Silver", Stock = 4,  ExtraPrice = 0, CreatedAt = seed },

            // ── Nike Strike Football (bbbb0007) ───────────────────
            new ProductVariant { Id = Guid.Parse("dddd0037-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0007-0000-0000-0000-000000000000"), Size = "4", Color = null, Stock = 25, ExtraPrice = 0,     CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0038-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0007-0000-0000-0000-000000000000"), Size = "5", Color = null, Stock = 40, ExtraPrice = 5.00m, CreatedAt = seed },

            // ── Spalding NBA Basketball (bbbb0008) ────────────────
            new ProductVariant { Id = Guid.Parse("dddd0039-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0008-0000-0000-0000-000000000000"), Size = "5 (Youth)",    Color = null, Stock = 15, ExtraPrice = -20.00m, CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0040-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0008-0000-0000-0000-000000000000"), Size = "7 (Official)",  Color = null, Stock = 30, ExtraPrice = 0,       CreatedAt = seed },

            // ── Yonex Astrox 88S (bbbb0009) ──────────────────────
            new ProductVariant { Id = Guid.Parse("dddd0041-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0009-0000-0000-0000-000000000000"), Size = "3U", Color = "Black/Silver", Stock = 12, ExtraPrice = 0,      CreatedAt = seed },
            new ProductVariant { Id = Guid.Parse("dddd0042-0000-0000-0000-000000000000"), ProductId = Guid.Parse("bbbb0009-0000-0000-0000-000000000000"), Size = "4U", Color = "Black/Silver", Stock = 15, ExtraPrice = -10.00m, CreatedAt = seed }
        );
    }
}
