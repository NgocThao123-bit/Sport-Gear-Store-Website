using AutoMapper;
using MediatR;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Application.Common.Models;
using SportGearStore.Application.Features.Orders.DTOs;

namespace SportGearStore.Application.Features.Orders.Queries.GetOrders;

public class GetOrdersHandler : IRequestHandler<GetOrdersQuery, PagedResult<OrderDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetOrdersHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PagedResult<OrderDto>> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
    {
        var paged = await _unitOfWork.Orders.GetByUserAsync(
            request.UserId, request.PageNumber, request.PageSize, cancellationToken);

        return new PagedResult<OrderDto>
        {
            Items = _mapper.Map<List<OrderDto>>(paged.Items),
            TotalCount = paged.TotalCount,
            PageNumber = paged.PageNumber,
            PageSize = paged.PageSize
        };
    }
}
