using AutoMapper;
using MediatR;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Application.Features.Cart.DTOs;

namespace SportGearStore.Application.Features.Cart.Queries.GetCart;

public class GetCartHandler : IRequestHandler<GetCartQuery, CartDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetCartHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<CartDto> Handle(GetCartQuery request, CancellationToken cancellationToken)
    {
        var cart = await _unitOfWork.Carts.GetByUserIdAsync(request.UserId, cancellationToken);

        // Return empty cart if none exists yet
        // Trả về giỏ hàng trống nếu chưa có
        if (cart == null)
            return new CartDto(Guid.Empty, new List<CartItemDto>(), 0, 0);

        return _mapper.Map<CartDto>(cart);
    }
}
