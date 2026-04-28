// ============================================================
// FILE: Features/Products/DTOs/ProductDtos.cs
// PURPOSE: Data shapes for product API responses.
//          ProductDto   → used in listing pages (less data, faster)
//          ProductDetailDto → used in product detail page (full data)
// MỤC ĐÍCH: Cấu trúc dữ liệu cho API response sản phẩm.
//           ProductDto       → dùng trong trang danh sách (ít dữ liệu hơn, nhanh hơn)
//           ProductDetailDto → dùng trong trang chi tiết sản phẩm (đầy đủ dữ liệu)
// ============================================================

namespace SportGearStore.Application.Features.Products.DTOs;

public record ProductDto(
    Guid Id,
    string Name,
    string Slug,
    string Brand,
    decimal Price,
    decimal? SalePrice,
    string CategoryName,
    string? MainImageUrl,
    double AverageRating,
    int ReviewCount
);

public record ProductDetailDto(
    Guid Id,
    string Name,
    string Slug,
    string Brand,
    string? Description,
    decimal Price,
    decimal? SalePrice,
    Guid CategoryId,
    string CategoryName,
    bool IsActive,
    List<ProductImageDto> Images,
    List<ProductVariantDto> Variants,
    List<ReviewDto> Reviews,
    double AverageRating,
    int ReviewCount
);

public record ProductImageDto(
    Guid Id,
    string ImageUrl,
    bool IsMain,
    int DisplayOrder
);

public record ProductVariantDto(
    Guid Id,
    string? Size,
    string? Color,
    int Stock,
    decimal ExtraPrice
);

public record ReviewDto(
    Guid Id,
    string UserFullName,
    int Rating,
    string? Comment,
    DateTime CreatedAt
);
