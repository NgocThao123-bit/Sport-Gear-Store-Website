// ============================================================
// FILE: Configurations/OrderConfiguration.cs
// MỤC ĐÍCH: Cấu hình bảng Orders và OrderItems.
// ============================================================

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Infrastructure.Persistence.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);
        builder.Property(o => o.OrderNumber).IsRequired().HasMaxLength(50);
        builder.Property(o => o.ShippingAddress).IsRequired().HasMaxLength(1000);
        builder.Property(o => o.PaymentMethod).IsRequired().HasMaxLength(50);
        builder.Property(o => o.Notes).HasMaxLength(500);
        builder.Property(o => o.SubTotal).HasColumnType("decimal(18,2)");
        builder.Property(o => o.ShippingFee).HasColumnType("decimal(18,2)");
        builder.Property(o => o.TotalAmount).HasColumnType("decimal(18,2)");

        // Store enum as int in DB (default), but give it a readable column name
        // Lưu enum dạng int trong DB (mặc định)
        builder.Property(o => o.Status).HasConversion<int>();
        builder.Property(o => o.PaymentStatus).HasConversion<int>();

        builder.HasIndex(o => o.OrderNumber).IsUnique();
        builder.HasIndex(o => o.UserId);

        builder.HasOne(o => o.User)
               .WithMany(u => u.Orders)
               .HasForeignKey(o => o.UserId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.HasKey(i => i.Id);
        builder.Property(i => i.ProductName).IsRequired().HasMaxLength(200);
        builder.Property(i => i.ProductImageUrl).HasMaxLength(1000);
        builder.Property(i => i.VariantInfo).HasMaxLength(200);
        builder.Property(i => i.UnitPrice).HasColumnType("decimal(18,2)");
        builder.Property(i => i.TotalPrice).HasColumnType("decimal(18,2)");

        builder.HasOne(i => i.Order)
               .WithMany(o => o.Items)
               .HasForeignKey(i => i.OrderId)
               .OnDelete(DeleteBehavior.Cascade);

        // No cascade on Product — snapshot data means the FK is for reference only
        // Không cascade trên Product — dữ liệu snapshot nên FK chỉ để tham chiếu
        builder.HasOne(i => i.Product)
               .WithMany(p => p.OrderItems)
               .HasForeignKey(i => i.ProductId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(i => i.ProductVariant)
               .WithMany(v => v.OrderItems)
               .HasForeignKey(i => i.ProductVariantId)
               .OnDelete(DeleteBehavior.SetNull);
    }
}
