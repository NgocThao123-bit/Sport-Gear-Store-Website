// ============================================================
// FILE: Persistence/AppDbContext.cs
// PURPOSE: The main EF Core database context.
//          It knows about all tables and applies configurations.
// MỤC ĐÍCH: Context database chính của EF Core.
//           Nó biết về tất cả các bảng và áp dụng các cấu hình.
//
// ORDER: Create this FIRST in Infrastructure — repositories need it.
//        Tạo file này ĐẦU TIÊN trong Infrastructure — repositories cần nó.
// ============================================================

using System.Reflection;
using Microsoft.EntityFrameworkCore;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Each DbSet = one database table
    // Mỗi DbSet = một bảng trong database
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Review> Reviews => Set<Review>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Scan this assembly and apply ALL IEntityTypeConfiguration<T> classes automatically
        // Quét assembly này và tự động áp dụng TẤT CẢ các class IEntityTypeConfiguration<T>
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
