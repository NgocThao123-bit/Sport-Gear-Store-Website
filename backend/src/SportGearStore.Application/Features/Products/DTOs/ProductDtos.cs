// ============================================================
// FILE: Features/Products/DTOs/ProductDtos.cs
// PURPOSE: Data shapes for product API responses.
// MỤC ĐÍCH: Cấu trúc dữ liệu cho API response sản phẩm.
//
// WHY property-based records (not positional)?
// AutoMapper requires a 0-arg constructor to set properties.
// Positional records only expose a constructor with all required args,
// which AutoMapper cannot call automatically.
// TẠI SAO dùng record thuộc tính (không phải positional)?
// AutoMapper cần constructor 0 tham số để set thuộc tính.
// Record positional chỉ có constructor với tất cả tham số bắt buộc.
// ============================================================

namespace SportGearStore.Application.Features.Products.DTOs;

public record ProductDto
{
    public Guid      Id            { get; init; }
    public string    Name          { get; init; } = string.Empty;
    public string    Slug          { get; init; } = string.Empty;
    public string    Brand         { get; init; } = string.Empty;
    public decimal   Price         { get; init; }
    public decimal?  SalePrice     { get; init; }
    public string    CategoryName  { get; init; } = string.Empty;
    public string?   MainImageUrl  { get; init; }
    public double    AverageRating { get; init; }
    public int       ReviewCount   { get; init; }
}

public record ProductDetailDto
{
    public Guid              Id            { get; init; }
    public string            Name          { get; init; } = string.Empty;
    public string            Slug          { get; init; } = string.Empty;
    public string            Brand         { get; init; } = string.Empty;
    public string?           Description   { get; init; }
    public decimal           Price         { get; init; }
    public decimal?          SalePrice     { get; init; }
    public Guid              CategoryId    { get; init; }
    public string            CategoryName  { get; init; } = string.Empty;
    public bool              IsActive      { get; init; }
    public List<ProductImageDto>   Images        { get; init; } = new();
    public List<ProductVariantDto> Variants      { get; init; } = new();
    public List<ReviewDto>         Reviews       { get; init; } = new();
    public double            AverageRating { get; init; }
    public int               ReviewCount   { get; init; }
}

public record ProductImageDto
{
    public Guid   Id           { get; init; }
    public string ImageUrl     { get; init; } = string.Empty;
    public bool   IsMain       { get; init; }
    public int    DisplayOrder { get; init; }
}

public record ProductVariantDto
{
    public Guid    Id         { get; init; }
    public string? Size       { get; init; }
    public string? Color      { get; init; }
    public int     Stock      { get; init; }
    public decimal ExtraPrice { get; init; }
}

public record ReviewDto
{
    public Guid      Id           { get; init; }
    public string    UserFullName { get; init; } = string.Empty;
    public int       Rating       { get; init; }
    public string?   Comment      { get; init; }
    public DateTime  CreatedAt    { get; init; }
}
