// ============================================================
// FILE: Configurations/RoleConfiguration.cs
// PURPOSE: Configures the Roles table and seeds default roles.
// MỤC ĐÍCH: Cấu hình bảng Roles và seed dữ liệu roles mặc định.
// ============================================================

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Infrastructure.Persistence.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Name).IsRequired().HasMaxLength(50);

        // Seed the two default roles — these are inserted on first migration
        // Seed hai role mặc định — được chèn vào lần migration đầu tiên
        builder.HasData(
            new Role { Id = 1, Name = "Customer" },
            new Role { Id = 2, Name = "Admin" }
        );
    }
}
