// ============================================================
// FILE: Features/Products/Commands/UpdateProduct/UpdateProductCommand.cs
// MỤC ĐÍCH: Input cho use case "cập nhật sản phẩm" (chỉ Admin).
// ============================================================

using MediatR;

namespace SportGearStore.Application.Features.Products.Commands.UpdateProduct;

public record UpdateProductCommand(
    Guid Id,
    string Name,
    string Brand,
    string? Description,
    decimal Price,
    decimal? SalePrice,
    Guid CategoryId,
    bool IsActive
) : IRequest;  // IRequest without <T> means it returns nothing (void)
               // IRequest không có <T> nghĩa là không trả về gì (void)
