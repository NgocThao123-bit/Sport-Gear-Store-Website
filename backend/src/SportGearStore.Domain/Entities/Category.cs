// ============================================================
// FILE: Entities/Category.cs
// PURPOSE: Represents a product category (e.g. Running, Cycling, Team Sports).
// MỤC ĐÍCH: Đại diện cho danh mục sản phẩm (VD: Running, Cycling, Team Sports).
// ============================================================

using SportGearStore.Domain.Common;

namespace SportGearStore.Domain.Entities;

public class Category : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    // URL-friendly version of the name, e.g. "team-sports"
    // Phiên bản thân thiện với URL của tên, VD: "team-sports"
    public string Slug { get; set; } = string.Empty;

    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation property: one category has many products
    // Một danh mục có nhiều sản phẩm
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
