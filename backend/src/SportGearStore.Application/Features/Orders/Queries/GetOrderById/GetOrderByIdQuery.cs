using MediatR;
using SportGearStore.Application.Features.Orders.DTOs;

namespace SportGearStore.Application.Features.Orders.Queries.GetOrderById;

public record GetOrderByIdQuery(Guid OrderId, Guid RequestingUserId, bool IsAdmin)
    : IRequest<OrderDetailDto>;
