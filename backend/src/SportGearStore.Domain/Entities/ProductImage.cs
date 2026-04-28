// ============================================================
// FILE: Entities/ProductImage.cs
// PURPOSE: Stores image URLs for a product. One product can have many images.
// MỤC ĐÍCH: Lưu URL hình ảnh cho sản phẩm. Một sản phẩm có thể có nhiều hình ảnh.
// ============================================================

using SportGearStore.Domain.Common;

namespace SportGearStore.Domain.Entities;

public class ProductImage : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public string ImageUrl { get; set; } = string.Empty;

    // True = this is the thumbnail shown in product listings
    // True = đây là ảnh đại diện hiển thị trong danh sách sản phẩm
    public bool IsMain { get; set; } = false;

    // Controls the order images appear in the gallery
    // Kiểm soát thứ tự hiển thị ảnh trong gallery
    public int DisplayOrder { get; set; } = 0;
}
