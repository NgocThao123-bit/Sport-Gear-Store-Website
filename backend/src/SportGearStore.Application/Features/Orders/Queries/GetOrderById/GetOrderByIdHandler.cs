using AutoMapper;
using MediatR;
using SportGearStore.Application.Common.Exceptions;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Application.Features.Orders.DTOs;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Application.Features.Orders.Queries.GetOrderById;

public class GetOrderByIdHandler : IRequestHandler<GetOrderByIdQuery, OrderDetailDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetOrderByIdHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<OrderDetailDto> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
    {
        var order = await _unitOfWork.Orders.GetDetailAsync(request.OrderId, cancellationToken);
        if (order == null)
            throw new NotFoundException(nameof(Order), request.OrderId);

        // Non-admin users can only view their own orders
        // Người dùng không phải admin chỉ có thể xem đơn hàng của mình
        if (!request.IsAdmin && order.UserId != request.RequestingUserId)
            throw new ForbiddenException();

        return _mapper.Map<OrderDetailDto>(order);
    }
}
