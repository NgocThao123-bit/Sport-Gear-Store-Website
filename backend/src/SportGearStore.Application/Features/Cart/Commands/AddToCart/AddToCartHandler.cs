// ============================================================
// FILE: Features/Cart/Commands/AddToCart/AddToCartHandler.cs
// MỤC ĐÍCH: Xử lý logic thêm sản phẩm vào giỏ hàng.
// ============================================================

using MediatR;
using SportGearStore.Application.Common.Exceptions;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Domain.Entities;

// "Cart" conflicts with the namespace — use full alias to disambiguate
// "Cart" xung đột với namespace — dùng alias đầy đủ để phân biệt
using CartEntity = SportGearStore.Domain.Entities.Cart;

namespace SportGearStore.Application.Features.Cart.Commands.AddToCart;

public class AddToCartHandler : IRequestHandler<AddToCartCommand>
{
    private readonly IUnitOfWork _unitOfWork;

    public AddToCartHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(AddToCartCommand request, CancellationToken cancellationToken)
    {
        // 1. Verify product exists and is active
        //    Xác minh sản phẩm tồn tại và đang hoạt động
        var product = await _unitOfWork.Products.GetByIdAsync(request.ProductId, cancellationToken);
        if (product == null || !product.IsActive)
            throw new NotFoundException(nameof(Product), request.ProductId);

        // 2. Determine unit price (base + variant extra)
        //    Xác định đơn giá (cơ bản + thêm biến thể)
        var unitPrice = product.SalePrice ?? product.Price;
        if (request.ProductVariantId.HasValue)
        {
            var variant = product.Variants.FirstOrDefault(v => v.Id == request.ProductVariantId.Value);
            if (variant == null)
                throw new NotFoundException(nameof(ProductVariant), request.ProductVariantId.Value);
            unitPrice += variant.ExtraPrice;
        }

        // 3. Get or create the cart
        //    Lấy hoặc tạo giỏ hàng
        var cart = await _unitOfWork.Carts.GetByUserIdAsync(request.UserId, cancellationToken);
        if (cart == null)
        {
            cart = new CartEntity { UserId = request.UserId };
            await _unitOfWork.Carts.AddAsync(cart, cancellationToken);
        }

        // 4. If same item already in cart, increase quantity
        //    Nếu item đó đã có trong giỏ, tăng số lượng
        var existingItem = cart.Items.FirstOrDefault(i =>
            i.ProductId == request.ProductId &&
            i.ProductVariantId == request.ProductVariantId);

        if (existingItem != null)
        {
            existingItem.Quantity += request.Quantity;
            existingItem.UnitPrice = unitPrice; // Refresh price in case it changed
        }
        else
        {
            cart.Items.Add(new CartItem
            {
                CartId = cart.Id,
                ProductId = request.ProductId,
                ProductVariantId = request.ProductVariantId,
                Quantity = request.Quantity,
                UnitPrice = unitPrice
            });
        }

        _unitOfWork.Carts.Update(cart);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
