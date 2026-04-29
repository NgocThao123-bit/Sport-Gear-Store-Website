using Microsoft.EntityFrameworkCore;
using SportGearStore.Application.Common.Interfaces.Repositories;
using SportGearStore.Application.Common.Models;
using SportGearStore.Domain.Entities;
using SportGearStore.Domain.Enums;

namespace SportGearStore.Infrastructure.Persistence.Repositories;

public class OrderRepository : GenericRepository<Order>, IOrderRepository
{
    public OrderRepository(AppDbContext context) : base(context) { }

    public async Task<Order?> GetDetailAsync(Guid id, CancellationToken cancellationToken = default)
        => await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

    public async Task<Order?> GetByOrderNumberAsync(string orderNumber, CancellationToken cancellationToken = default)
        => await _context.Orders
            .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber, cancellationToken);

    public async Task<PagedResult<Order>> GetByUserAsync(
        Guid userId, int pageNumber, int pageSize,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Orders
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Include(o => o.Items)
            .ToListAsync(cancellationToken);

        return new PagedResult<Order>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<PagedResult<Order>> GetAllPagedAsync(
        int pageNumber, int pageSize, OrderStatus? status,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Orders
            .Include(o => o.User)
            .OrderByDescending(o => o.CreatedAt)
            .AsQueryable();

        if (status.HasValue)
            query = query.Where(o => o.Status == status.Value);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Order>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }
}
