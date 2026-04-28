// ============================================================
// FILE: Features/Products/Commands/CreateProduct/CreateProductCommand.cs
// PURPOSE: Input for the "create product" use case (Admin only).
// MỤC ĐÍCH: Input cho use case "tạo sản phẩm" (chỉ Admin).
// ============================================================

using MediatR;

namespace SportGearStore.Application.Features.Products.Commands.CreateProduct;

public record CreateProductCommand(
    string Name,
    string Brand,
    string? Description,
    decimal Price,
    decimal? SalePrice,
    Guid CategoryId,
    List<CreateProductVariantDto> Variants,
    List<string> ImageUrls,     // List of uploaded image URLs
    string? MainImageUrl        // Which URL is the main/thumbnail
) : IRequest<Guid>;             // Returns the new product's Id

public record CreateProductVariantDto(
    string? Size,
    string? Color,
    int Stock,
    decimal ExtraPrice
);
