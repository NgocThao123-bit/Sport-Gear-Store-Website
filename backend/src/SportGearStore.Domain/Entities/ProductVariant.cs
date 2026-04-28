// ============================================================
// FILE: Entities/ProductVariant.cs
// PURPOSE: Represents a specific size/color variation of a product.
//          Each variant has its own stock count.
//          E.g. Nike Air Max — Size 42, Color: Black → Stock: 10
// MỤC ĐÍCH: Đại diện cho một biến thể kích thước/màu sắc cụ thể của sản phẩm.
//           Mỗi biến thể có số lượng tồn kho riêng.
// ============================================================

using SportGearStore.Domain.Common;

namespace SportGearStore.Domain.Entities;

public class ProductVariant : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    // e.g. "42", "XL", "One Size"
    public string? Size { get; set; }

    // e.g. "Black", "Red", "White"
    public string? Color { get; set; }

    // How many units are in stock for this specific variant
    // Số lượng tồn kho cho biến thể cụ thể này
    public int Stock { get; set; } = 0;

    // Extra cost on top of base product price (can be 0)
    // Chi phí thêm trên giá gốc của sản phẩm (có thể là 0)
    public decimal ExtraPrice { get; set; } = 0;

    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
