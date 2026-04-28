using MediatR;
using SportGearStore.Domain.Enums;

namespace SportGearStore.Application.Features.Orders.Commands.UpdateOrderStatus;

// Admin use case: move order through the status pipeline
// Use case của Admin: chuyển đơn hàng qua luồng trạng thái
public record UpdateOrderStatusCommand(Guid OrderId, OrderStatus NewStatus) : IRequest;
