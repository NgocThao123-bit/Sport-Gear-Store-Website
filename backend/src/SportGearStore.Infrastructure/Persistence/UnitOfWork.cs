// ============================================================
// FILE: Persistence/UnitOfWork.cs
// PURPOSE: Implements IUnitOfWork — groups all repositories under
//          one EF Core DbContext so they share the same transaction.
// MỤC ĐÍCH: Triển khai IUnitOfWork — nhóm tất cả repositories dưới
//           một EF Core DbContext để chúng chia sẻ cùng một transaction.
//
// HOW IT WORKS / CÁCH HOẠT ĐỘNG:
//   All repositories use the SAME _context instance.
//   When SaveChangesAsync() is called, ALL pending changes across
//   ALL repositories are saved in one atomic database transaction.
//   Tất cả repositories dùng CÙNG một _context instance.
//   Khi SaveChangesAsync() được gọi, TẤT CẢ thay đổi đang chờ trên
//   TẤT CẢ repositories được lưu trong một transaction nguyên tử.
// ============================================================

using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Application.Common.Interfaces.Repositories;
using SportGearStore.Infrastructure.Persistence.Repositories;

namespace SportGearStore.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    // Lazy initialization — repositories are created only when first accessed
    // Khởi tạo lười — repositories chỉ được tạo khi được truy cập lần đầu
    private IProductRepository? _products;
    private ICategoryRepository? _categories;
    private IUserRepository? _users;
    private IOrderRepository? _orders;
    private ICartRepository? _carts;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public IProductRepository Products
        => _products ??= new ProductRepository(_context);

    public ICategoryRepository Categories
        => _categories ??= new CategoryRepository(_context);

    public IUserRepository Users
        => _users ??= new UserRepository(_context);

    public IOrderRepository Orders
        => _orders ??= new OrderRepository(_context);

    public ICartRepository Carts
        => _carts ??= new CartRepository(_context);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        => await _context.SaveChangesAsync(cancellationToken);

    public void Dispose()
        => _context.Dispose();
}
