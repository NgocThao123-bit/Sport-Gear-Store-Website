// ============================================================
// FILE: Features/Products/Queries/GetProductById/GetProductByIdQuery.cs
// PURPOSE: Fetch full product details for the product detail page.
// MỤC ĐÍCH: Lấy đầy đủ chi tiết sản phẩm cho trang chi tiết sản phẩm.
// ============================================================

using MediatR;
using SportGearStore.Application.Features.Products.DTOs;

namespace SportGearStore.Application.Features.Products.Queries.GetProductById;

public record GetProductByIdQuery(Guid Id) : IRequest<ProductDetailDto>;
