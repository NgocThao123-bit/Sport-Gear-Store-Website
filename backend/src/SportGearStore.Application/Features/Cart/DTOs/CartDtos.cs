// ============================================================
// FILE: Features/Cart/DTOs/CartDtos.cs
// MỤC ĐÍCH: Cấu trúc dữ liệu cho API response giỏ hàng.
// ============================================================

namespace SportGearStore.Application.Features.Cart.DTOs;

public record CartDto(
    Guid Id,
    List<CartItemDto> Items,
    decimal TotalAmount,
    int TotalItems
);

public record CartItemDto(
    Guid Id,
    Guid ProductId,
    string ProductName,
    string? ProductImageUrl,
    string? VariantInfo,     // e.g. "Size: 42 | Color: Black"
    int Quantity,
    decimal UnitPrice,
    decimal TotalPrice
);
