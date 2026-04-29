// ============================================================
// FILE: Repositories/GenericRepository.cs
// PURPOSE: Base repository with common CRUD using EF Core.
//          All specific repositories inherit from this.
// MỤC ĐÍCH: Repository cơ bản với CRUD chung dùng EF Core.
//           Tất cả repository cụ thể đều kế thừa từ đây.
// ============================================================

using Microsoft.EntityFrameworkCore;
using SportGearStore.Application.Common.Interfaces.Repositories;
using SportGearStore.Domain.Common;

namespace SportGearStore.Infrastructure.Persistence.Repositories;

public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public GenericRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => await _dbSet.FindAsync([id], cancellationToken);

    public async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default)
        => await _dbSet.ToListAsync(cancellationToken);

    public async Task AddAsync(T entity, CancellationToken cancellationToken = default)
        => await _dbSet.AddAsync(entity, cancellationToken);

    // EF Core tracks the entity — just mark it modified
    // EF Core theo dõi entity — chỉ cần đánh dấu là đã thay đổi
    public void Update(T entity)
        => _dbSet.Update(entity);

    public void Delete(T entity)
        => _dbSet.Remove(entity);
}
