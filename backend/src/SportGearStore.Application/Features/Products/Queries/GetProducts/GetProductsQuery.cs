// ============================================================
// FILE: Features/Products/Queries/GetProducts/GetProductsQuery.cs
// PURPOSE: Input for the paginated product listing with filters.
//          Used by the shop listing page.
// MỤC ĐÍCH: Input cho trang danh sách sản phẩm có phân trang và bộ lọc.
//           Dùng bởi trang danh sách cửa hàng.
// ============================================================

using MediatR;
using SportGearStore.Application.Common.Models;
using SportGearStore.Application.Features.Products.DTOs;

namespace SportGearStore.Application.Features.Products.Queries.GetProducts;

public record GetProductsQuery(
    int PageNumber = 1,
    int PageSize = 10,
    Guid? CategoryId = null,
    string? SearchTerm = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null,
    string? SortBy = null       // e.g. "price_asc", "price_desc", "newest"
) : IRequest<PagedResult<ProductDto>>;
