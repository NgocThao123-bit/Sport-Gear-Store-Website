// ============================================================
// FILE: Entities/Product.cs
// PURPOSE: Represents a sports gear product in the store.
// MỤC ĐÍCH: Đại diện cho một sản phẩm dụng cụ thể thao trong cửa hàng.
// ORDER: Create after Category.cs
//        Tạo sau Category.cs
// ============================================================

using SportGearStore.Domain.Common;

namespace SportGearStore.Domain.Entities;

public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    // URL-friendly name, e.g. "nike-air-max-running"
    // Tên thân thiện với URL, VD: "nike-air-max-running"
    public string Slug { get; set; } = string.Empty;

    public string? Description { get; set; }
    public string Brand { get; set; } = string.Empty;

    // Original price of the product
    // Giá gốc của sản phẩm
    public decimal Price { get; set; }

    // Discounted price — null means no active discount
    // Giá khuyến mãi — null nghĩa là không có khuyến mãi
    public decimal? SalePrice { get; set; }

    public bool IsActive { get; set; } = true;

    // Foreign key to Category
    // Khóa ngoại tới Category
    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    // Navigation properties
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
}
