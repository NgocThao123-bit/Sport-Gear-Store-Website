// ============================================================
// FILE: Configurations/UserConfiguration.cs
// PURPOSE: Defines constraints for the Users table.
// MỤC ĐÍCH: Định nghĩa các ràng buộc cho bảng Users.
// ============================================================

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);

        builder.Property(u => u.Email).IsRequired().HasMaxLength(256);
        builder.Property(u => u.PasswordHash).IsRequired();
        builder.Property(u => u.FirstName).IsRequired().HasMaxLength(100);
        builder.Property(u => u.LastName).IsRequired().HasMaxLength(100);
        builder.Property(u => u.Phone).HasMaxLength(20);
        builder.Property(u => u.Address).HasMaxLength(500);

        // Email must be unique across all users
        // Email phải là duy nhất trên tất cả người dùng
        builder.HasIndex(u => u.Email).IsUnique();

        // One user has one cart
        // Một user có một giỏ hàng
        builder.HasOne(u => u.Cart)
               .WithOne(c => c.User)
               .HasForeignKey<Cart>(c => c.UserId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
