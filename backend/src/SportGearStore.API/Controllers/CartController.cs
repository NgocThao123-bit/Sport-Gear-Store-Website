// ============================================================
// FILE: Controllers/CartController.cs
// PURPOSE: Cart endpoints — all require authentication (logged-in customers).
// MỤC ĐÍCH: Endpoints giỏ hàng — tất cả yêu cầu xác thực (khách hàng đã đăng nhập).
//
// ENDPOINTS:
//   GET    /api/cart              → get current user's cart
//   POST   /api/cart/items        → add item to cart
//   DELETE /api/cart/items/{id}   → remove item from cart
// ============================================================

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportGearStore.Application.Common.Interfaces.Services;
using SportGearStore.Application.Features.Cart.Commands.AddToCart;
using SportGearStore.Application.Features.Cart.Commands.RemoveFromCart;
using SportGearStore.Application.Features.Cart.Queries.GetCart;

namespace SportGearStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]  // All cart endpoints require a valid JWT token
             // Tất cả endpoint giỏ hàng đều yêu cầu JWT token hợp lệ
public class CartController : ControllerBase
{
    private readonly ISender _sender;
    private readonly ICurrentUserService _currentUser;

    public CartController(ISender sender, ICurrentUserService currentUser)
    {
        _sender = sender;
        _currentUser = currentUser;
    }

    // GET /api/cart
    [HttpGet]
    public async Task<IActionResult> GetCart(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new GetCartQuery(_currentUser.UserId!.Value),
            cancellationToken);
        return Ok(result);
    }

    // POST /api/cart/items
    // Body: { "productId": "...", "productVariantId": "...", "quantity": 1 }
    [HttpPost("items")]
    public async Task<IActionResult> AddToCart(
        [FromBody] AddToCartRequest request,
        CancellationToken cancellationToken)
    {
        await _sender.Send(
            new AddToCartCommand(
                _currentUser.UserId!.Value,
                request.ProductId,
                request.ProductVariantId,
                request.Quantity),
            cancellationToken);

        return NoContent();
    }

    // DELETE /api/cart/items/{itemId}
    [HttpDelete("items/{itemId:guid}")]
    public async Task<IActionResult> RemoveFromCart(
        Guid itemId,
        CancellationToken cancellationToken)
    {
        await _sender.Send(
            new RemoveFromCartCommand(_currentUser.UserId!.Value, itemId),
            cancellationToken);

        return NoContent();
    }
}

// Simple request body for adding to cart
// Body đơn giản để thêm vào giỏ hàng
public record AddToCartRequest(
    Guid ProductId,
    Guid? ProductVariantId,
    int Quantity = 1
);
