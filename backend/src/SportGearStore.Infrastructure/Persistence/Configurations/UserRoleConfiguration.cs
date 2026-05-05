// ============================================================
// FILE: Configurations/UserRoleConfiguration.cs
// PURPOSE: Configures the junction table between Users and Roles.
//          Composite primary key: (UserId + RoleId).
// MỤC ĐÍCH: Cấu hình bảng trung gian giữa Users và Roles.
//           Khóa chính kép: (UserId + RoleId).
// ============================================================

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Infrastructure.Persistence.Configurations;

public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        // Composite primary key — no separate Id column needed
        // Khóa chính kép — không cần cột Id riêng
        builder.HasKey(ur => new { ur.UserId, ur.RoleId });

        builder.HasOne(ur => ur.User)
               .WithMany(u => u.UserRoles)
               .HasForeignKey(ur => ur.UserId);

        builder.HasOne(ur => ur.Role)
               .WithMany(r => r.UserRoles)
               .HasForeignKey(ur => ur.RoleId);

        builder.HasData(
            new UserRole { UserId = Guid.Parse("eeee0001-0000-0000-0000-000000000000"), RoleId = 2 }, // Admin
            new UserRole { UserId = Guid.Parse("eeee0002-0000-0000-0000-000000000000"), RoleId = 1 }  // Customer
        );
    }
}
