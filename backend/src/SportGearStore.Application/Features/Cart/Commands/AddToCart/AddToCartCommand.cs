// ============================================================
// FILE: Features/Cart/Commands/AddToCart/AddToCartCommand.cs
// PURPOSE: Add a product (with optional variant) to the user's cart.
//          If the same product+variant already exists, increments quantity.
// MỤC ĐÍCH: Thêm sản phẩm (có thể có biến thể) vào giỏ hàng của người dùng.
//           Nếu sản phẩm+biến thể đã tồn tại, tăng số lượng.
// ============================================================

using MediatR;

namespace SportGearStore.Application.Features.Cart.Commands.AddToCart;

public record AddToCartCommand(
    Guid UserId,
    Guid ProductId,
    Guid? ProductVariantId,
    int Quantity
) : IRequest;
