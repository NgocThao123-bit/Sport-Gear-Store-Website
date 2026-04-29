using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Infrastructure.Persistence.Configurations;

public class CartConfiguration : IEntityTypeConfiguration<Cart>
{
    public void Configure(EntityTypeBuilder<Cart> builder)
    {
        builder.HasKey(c => c.Id);

        // Each cart belongs to one user (already configured in UserConfiguration)
        // Mỗi giỏ hàng thuộc về một user (đã cấu hình trong UserConfiguration)
    }
}

public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
{
    public void Configure(EntityTypeBuilder<CartItem> builder)
    {
        builder.HasKey(i => i.Id);
        builder.Property(i => i.UnitPrice).HasColumnType("decimal(18,2)");

        builder.HasOne(i => i.Cart)
               .WithMany(c => c.Items)
               .HasForeignKey(i => i.CartId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(i => i.Product)
               .WithMany(p => p.CartItems)
               .HasForeignKey(i => i.ProductId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(i => i.ProductVariant)
               .WithMany(v => v.CartItems)
               .HasForeignKey(i => i.ProductVariantId)
               .OnDelete(DeleteBehavior.SetNull);
    }
}
