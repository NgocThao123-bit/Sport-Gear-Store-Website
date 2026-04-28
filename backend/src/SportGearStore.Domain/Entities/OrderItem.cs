// ============================================================
// FILE: Entities/OrderItem.cs
// PURPOSE: A line item inside an order. We snapshot ProductName
//          and UnitPrice because the original product may be edited
//          or deleted in the future — order history must stay accurate.
// MỤC ĐÍCH: Dòng sản phẩm trong đơn hàng. Chúng ta snapshot ProductName
//           và UnitPrice vì sản phẩm gốc có thể bị chỉnh sửa
//           hoặc xóa sau này — lịch sử đơn hàng phải luôn chính xác.
// ============================================================

using SportGearStore.Domain.Common;

namespace SportGearStore.Domain.Entities;

public class OrderItem : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    // Keep FK for reference, but use snapshots for display
    // Giữ FK để tham chiếu, nhưng dùng snapshot để hiển thị
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public Guid? ProductVariantId { get; set; }
    public ProductVariant? ProductVariant { get; set; }

    // Snapshots — these never change after order is placed
    // Snapshot — những giá trị này không bao giờ thay đổi sau khi đặt hàng
    public string ProductName { get; set; } = string.Empty;
    public string? ProductImageUrl { get; set; }
    public string? VariantInfo { get; set; }  // e.g. "Size: 42, Color: Black"

    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }

    // UnitPrice * Quantity
    public decimal TotalPrice { get; set; }
}
