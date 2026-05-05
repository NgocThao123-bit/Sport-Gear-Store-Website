// ============================================================
// FILE: Features/Orders/DTOs/OrderDtos.cs
// MỤC ĐÍCH: Cấu trúc dữ liệu cho API response đơn hàng.
// ============================================================

using SportGearStore.Domain.Enums;

namespace SportGearStore.Application.Features.Orders.DTOs;

// Lightweight — used in order list / history page and admin order table
// Nhẹ — dùng trong trang danh sách / lịch sử đơn hàng và bảng admin
public record OrderDto
{
    public Guid          Id                 { get; init; }
    public string        OrderNumber        { get; init; } = string.Empty;
    public string        CustomerEmail      { get; init; } = string.Empty;
    public string?       FirstItemImageUrl  { get; init; }
    public string?       FirstItemName      { get; init; }
    public OrderStatus   Status             { get; init; }
    public PaymentStatus PaymentStatus      { get; init; }
    public decimal       TotalAmount        { get; init; }
    public int           ItemCount          { get; init; }
    public DateTime      CreatedAt          { get; init; }
}

// Full detail — used in order detail page
// Chi tiết đầy đủ — dùng trong trang chi tiết đơn hàng
public record OrderDetailDto
{
    public Guid               Id              { get; init; }
    public string             OrderNumber     { get; init; } = string.Empty;
    public OrderStatus        Status          { get; init; }
    public PaymentStatus      PaymentStatus   { get; init; }
    public decimal            SubTotal        { get; init; }
    public decimal            ShippingFee     { get; init; }
    public decimal            TotalAmount     { get; init; }
    public string             ShippingAddress { get; init; } = string.Empty;
    public string             PaymentMethod   { get; init; } = string.Empty;
    public string?            Notes           { get; init; }
    public DateTime           CreatedAt       { get; init; }
    public List<OrderItemDto> Items           { get; init; } = new();
}

public record OrderItemDto
{
    public Guid    Id              { get; init; }
    public string  ProductName     { get; init; } = string.Empty;
    public string? ProductImageUrl { get; init; }
    public string? VariantInfo     { get; init; }
    public int     Quantity        { get; init; }
    public decimal UnitPrice       { get; init; }
    public decimal TotalPrice      { get; init; }
}
