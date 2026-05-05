using MediatR;
using SportGearStore.Application.Common.Models;
using SportGearStore.Application.Features.Orders.DTOs;
using SportGearStore.Domain.Enums;

namespace SportGearStore.Application.Features.Orders.Queries.GetAllOrders;

// Admin-only: get every order in the system with optional status filter + pagination
// Admin: lấy tất cả đơn hàng trong hệ thống với lọc trạng thái và phân trang
public record GetAllOrdersQuery(int PageNumber = 1, int PageSize = 20, OrderStatus? Status = null)
    : IRequest<PagedResult<OrderDto>>;
