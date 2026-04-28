// ============================================================
// FILE: Enums/OrderStatus.cs
// PURPOSE: Defines the possible states of an order in its lifecycle.
// MỤC ĐÍCH: Định nghĩa các trạng thái có thể có của đơn hàng trong vòng đời của nó.
// ============================================================

namespace SportGearStore.Domain.Enums;

public enum OrderStatus
{
    // Order placed but not yet confirmed
    // Đơn hàng đã đặt nhưng chưa được xác nhận
    Pending = 1,

    // Order confirmed, being prepared
    // Đơn hàng đã xác nhận, đang chuẩn bị
    Processing = 2,

    // Order handed to shipping carrier
    // Đơn hàng đã giao cho đơn vị vận chuyển
    Shipped = 3,

    // Order received by customer
    // Khách hàng đã nhận được đơn hàng
    Delivered = 4,

    // Order cancelled by customer or admin
    // Đơn hàng bị hủy bởi khách hàng hoặc admin
    Cancelled = 5
}
