// ============================================================
// FILE: Enums/PaymentStatus.cs
// PURPOSE: Defines the payment state of an order.
// MỤC ĐÍCH: Định nghĩa trạng thái thanh toán của đơn hàng.
// ============================================================

namespace SportGearStore.Domain.Enums;

public enum PaymentStatus
{
    // Payment not yet made
    // Chưa thanh toán
    Unpaid = 1,

    // Payment successfully received
    // Đã thanh toán thành công
    Paid = 2,

    // Payment was refunded to customer
    // Tiền đã được hoàn lại cho khách hàng
    Refunded = 3
}
