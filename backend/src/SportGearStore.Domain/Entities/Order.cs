// ============================================================
// FILE: Entities/Order.cs
// PURPOSE: Represents a placed order. Once created, order data is
//          immutable — we snapshot prices and names at order time.
// MỤC ĐÍCH: Đại diện cho đơn hàng đã đặt. Sau khi tạo, dữ liệu đơn hàng
//           không thay đổi — chúng ta snapshot giá và tên tại thời điểm đặt hàng.
// ORDER: Create after User.cs
//        Tạo sau User.cs
// ============================================================

using SportGearStore.Domain.Common;
using SportGearStore.Domain.Enums;

namespace SportGearStore.Domain.Entities;

public class Order : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    // Human-readable order number, e.g. "SGS-20240428-001"
    // Mã đơn hàng dễ đọc, VD: "SGS-20240428-001"
    public string OrderNumber { get; set; } = string.Empty;

    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Unpaid;

    // Product costs only (before shipping)
    // Chỉ tiền hàng (chưa tính phí ship)
    public decimal SubTotal { get; set; }

    public decimal ShippingFee { get; set; }

    // SubTotal + ShippingFee
    public decimal TotalAmount { get; set; }

    // Full shipping address saved as a string snapshot
    // Địa chỉ giao hàng đầy đủ lưu dưới dạng chuỗi snapshot
    public string ShippingAddress { get; set; } = string.Empty;

    // e.g. "COD", "BankTransfer"
    public string PaymentMethod { get; set; } = string.Empty;

    public string? Notes { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
