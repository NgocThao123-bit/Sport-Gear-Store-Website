using MediatR;
using SportGearStore.Application.Common.Exceptions;
using SportGearStore.Application.Common.Interfaces;

namespace SportGearStore.Application.Features.Cart.Commands.RemoveFromCart;

public class RemoveFromCartHandler : IRequestHandler<RemoveFromCartCommand>
{
    private readonly IUnitOfWork _unitOfWork;

    public RemoveFromCartHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(RemoveFromCartCommand request, CancellationToken cancellationToken)
    {
        var cart = await _unitOfWork.Carts.GetByUserIdAsync(request.UserId, cancellationToken);
        if (cart == null)
            throw new NotFoundException("Cart", request.UserId);

        var item = cart.Items.FirstOrDefault(i => i.Id == request.CartItemId);
        if (item == null)
            throw new NotFoundException("CartItem", request.CartItemId);

        // Security check: ensure the item belongs to this user's cart
        // Kiểm tra bảo mật: đảm bảo item thuộc về giỏ hàng của user này
        if (item.CartId != cart.Id)
            throw new ForbiddenException();

        cart.Items.Remove(item);
        _unitOfWork.Carts.Update(cart);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
