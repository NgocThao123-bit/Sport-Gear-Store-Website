// ============================================================
// FILE: Common/Interfaces/Repositories/IOrderRepository.cs
// MỤC ĐÍCH: Các truy vấn đơn hàng.
// ============================================================

using SportGearStore.Application.Common.Models;
using SportGearStore.Domain.Entities;
using SportGearStore.Domain.Enums;

namespace SportGearStore.Application.Common.Interfaces.Repositories;

public interface IOrderRepository : IGenericRepository<Order>
{
    Task<Order?> GetDetailAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Order?> GetByOrderNumberAsync(string orderNumber, CancellationToken cancellationToken = default);

    // Get paginated orders for a specific user (customer's order history)
    // Lấy danh sách đơn hàng có phân trang cho một user cụ thể (lịch sử đơn hàng)
    Task<PagedResult<Order>> GetByUserAsync(Guid userId, int pageNumber, int pageSize, CancellationToken cancellationToken = default);

    // Admin: get all orders with optional status filter
    // Admin: lấy tất cả đơn hàng với bộ lọc trạng thái tùy chọn
    Task<PagedResult<Order>> GetAllPagedAsync(int pageNumber, int pageSize, OrderStatus? status, CancellationToken cancellationToken = default);
}
