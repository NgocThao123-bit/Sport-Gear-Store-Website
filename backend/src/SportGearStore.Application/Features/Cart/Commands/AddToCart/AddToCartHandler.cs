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
        // 1. Verify product exists and is active — AsNoTracking so EF doesn't interfere with SaveChanges
        //    Xác minh sản phẩm tồn tại — AsNoTracking để EF không can thiệp vào SaveChanges
        var product = await _unitOfWork.Products.GetWithVariantsAsync(request.ProductId, cancellationToken);
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

        // 4. Update existing item quantity or explicitly track a new CartItem
        //    Tăng số lượng item đã có hoặc theo dõi CartItem mới một cách tường minh
        var existingItem = cart.Items.FirstOrDefault(i =>
            i.ProductId == request.ProductId &&
            i.ProductVariantId == request.ProductVariantId);

        if (existingItem != null)
        {
            existingItem.Quantity += request.Quantity;
            existingItem.UnitPrice = unitPrice;
        }
        else
        {
            // Use AddItemAsync (explicit DbSet.Add) instead of collection navigation
            // to guarantee the CartItem enters the change tracker in Added state.
            // Dùng AddItemAsync (DbSet.Add tường minh) thay vì navigation collection
            // để đảm bảo CartItem được thêm vào change tracker ở trạng thái Added.
            await _unitOfWork.Carts.AddItemAsync(new CartItem
            {
                CartId           = cart.Id,
                ProductId        = request.ProductId,
                ProductVariantId = request.ProductVariantId,
                Quantity         = request.Quantity,
                UnitPrice        = unitPrice
            }, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
