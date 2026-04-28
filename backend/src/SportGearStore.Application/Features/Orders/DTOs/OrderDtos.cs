// ============================================================
// FILE: Features/Orders/DTOs/OrderDtos.cs
// MỤC ĐÍCH: Cấu trúc dữ liệu cho API response đơn hàng.
// ============================================================

using SportGearStore.Domain.Enums;

namespace SportGearStore.Application.Features.Orders.DTOs;

// Lightweight — used in order list / history page
// Nhẹ — dùng trong trang danh sách / lịch sử đơn hàng
public record OrderDto(
    Guid Id,
    string OrderNumber,
    OrderStatus Status,
    PaymentStatus PaymentStatus,
    decimal TotalAmount,
    int ItemCount,
    DateTime CreatedAt
);

// Full detail — used in order detail page
// Chi tiết đầy đủ — dùng trong trang chi tiết đơn hàng
public record OrderDetailDto(
    Guid Id,
    string OrderNumber,
    OrderStatus Status,
    PaymentStatus PaymentStatus,
    decimal SubTotal,
    decimal ShippingFee,
    decimal TotalAmount,
    string ShippingAddress,
    string PaymentMethod,
    string? Notes,
    DateTime CreatedAt,
    List<OrderItemDto> Items
);

public record OrderItemDto(
    Guid Id,
    string ProductName,
    string? ProductImageUrl,
    string? VariantInfo,
    int Quantity,
    decimal UnitPrice,
    decimal TotalPrice
);
