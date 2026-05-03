// ============================================================
// FILE: Features/Cart/DTOs/CartDtos.cs
// MỤC ĐÍCH: Cấu trúc dữ liệu cho API response giỏ hàng.
// ============================================================

namespace SportGearStore.Application.Features.Cart.DTOs;

public record CartDto
{
    public Guid              Id          { get; init; }
    public List<CartItemDto> Items       { get; init; } = new();
    public decimal           TotalAmount { get; init; }
    public int               TotalItems  { get; init; }
}

public record CartItemDto
{
    public Guid    Id              { get; init; }
    public Guid    ProductId       { get; init; }
    public string  ProductName     { get; init; } = string.Empty;
    public string? ProductImageUrl { get; init; }
    public string? VariantInfo     { get; init; }  // e.g. "Size: 42 | Color: Black"
    public int     Quantity        { get; init; }
    public decimal UnitPrice       { get; init; }
    public decimal TotalPrice      { get; init; }
}
