using MediatR;
using SportGearStore.Application.Common.Models;
using SportGearStore.Application.Features.Orders.DTOs;

namespace SportGearStore.Application.Features.Orders.Queries.GetOrders;

// Used for customer's own order history
// Dùng cho lịch sử đơn hàng của khách hàng
public record GetOrdersQuery(Guid UserId, int PageNumber = 1, int PageSize = 10)
    : IRequest<PagedResult<OrderDto>>;
