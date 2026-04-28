// ============================================================
// FILE: Entities/CartItem.cs
// PURPOSE: Represents a single product (with optional variant) in a cart.
// MỤC ĐÍCH: Đại diện cho một sản phẩm (có thể có biến thể) trong giỏ hàng.
// ============================================================

using SportGearStore.Domain.Common;

namespace SportGearStore.Domain.Entities;

public class CartItem : BaseEntity
{
    public Guid CartId { get; set; }
    public Cart Cart { get; set; } = null!;

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    // Optional: which size/color the customer selected
    // Tùy chọn: kích thước/màu sắc khách hàng đã chọn
    public Guid? ProductVariantId { get; set; }
    public ProductVariant? ProductVariant { get; set; }

    public int Quantity { get; set; } = 1;

    // Price snapshot at the time the item was added to cart
    // Snapshot giá tại thời điểm thêm vào giỏ hàng
    public decimal UnitPrice { get; set; }
}
