// ============================================================
// FILE: Common/Interfaces/Repositories/IProductRepository.cs
// PURPOSE: Product-specific queries beyond basic CRUD.
// MỤC ĐÍCH: Các truy vấn sản phẩm ngoài CRUD cơ bản.
// ============================================================

using SportGearStore.Application.Common.Models;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Application.Common.Interfaces.Repositories;

public interface IProductRepository : IGenericRepository<Product>
{
    // Filter + paginate products for the shop listing page
    // Lọc + phân trang sản phẩm cho trang danh sách cửa hàng
    Task<PagedResult<Product>> GetPagedAsync(
        int pageNumber,
        int pageSize,
        Guid? categoryId,
        string? searchTerm,
        decimal? minPrice,
        decimal? maxPrice,
        string? sortBy,
        CancellationToken cancellationToken = default);

    Task<Product?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);

    // Load product with all related data (images, variants, reviews)
    // Load sản phẩm với đầy đủ dữ liệu liên quan (ảnh, biến thể, đánh giá)
    Task<Product?> GetDetailAsync(Guid id, CancellationToken cancellationToken = default);

    // Lightweight read for cart handler — only price + variants, NOT tracked by EF
    // Đọc nhẹ cho cart handler — chỉ giá + biến thể, KHÔNG được EF theo dõi
    Task<Product?> GetWithVariantsAsync(Guid id, CancellationToken cancellationToken = default);

    // Same as GetDetailAsync but looks up by slug (used by the product detail page)
    Task<Product?> GetDetailBySlugAsync(string slug, CancellationToken cancellationToken = default);

    Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null, CancellationToken cancellationToken = default);
}
