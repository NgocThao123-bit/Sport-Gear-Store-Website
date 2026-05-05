// ============================================================
// FILE: Repositories/ProductRepository.cs
// PURPOSE: Implements product-specific queries (pagination, filtering, slug).
// MỤC ĐÍCH: Triển khai các truy vấn sản phẩm cụ thể (phân trang, lọc, slug).
// ============================================================

using Microsoft.EntityFrameworkCore;
using SportGearStore.Application.Common.Interfaces.Repositories;
using SportGearStore.Application.Common.Models;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Infrastructure.Persistence.Repositories;

public class ProductRepository : GenericRepository<Product>, IProductRepository
{
    public ProductRepository(AppDbContext context) : base(context) { }

    public async Task<PagedResult<Product>> GetPagedAsync(
        int pageNumber, int pageSize,
        Guid? categoryId, string? searchTerm,
        decimal? minPrice, decimal? maxPrice,
        string? sortBy,
        CancellationToken cancellationToken = default)
    {
        // Build query step by step — EF Core translates this to SQL at the end
        // Xây dựng query từng bước — EF Core dịch sang SQL ở cuối
        var query = _context.Products
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Include(p => p.Reviews.Where(r => r.IsApproved))
            .Where(p => p.IsActive)
            .AsQueryable();

        // Apply filters
        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId.Value);

        if (!string.IsNullOrWhiteSpace(searchTerm))
            query = query.Where(p =>
                p.Name.Contains(searchTerm) ||
                p.Brand.Contains(searchTerm) ||
                (p.Description != null && p.Description.Contains(searchTerm)));

        if (minPrice.HasValue)
            query = query.Where(p => (p.SalePrice ?? p.Price) >= minPrice.Value);

        if (maxPrice.HasValue)
            query = query.Where(p => (p.SalePrice ?? p.Price) <= maxPrice.Value);

        // Apply sorting
        query = sortBy switch
        {
            "price_asc"  => query.OrderBy(p => p.SalePrice ?? p.Price),
            "price_desc" => query.OrderByDescending(p => p.SalePrice ?? p.Price),
            "newest"     => query.OrderByDescending(p => p.CreatedAt),
            _            => query.OrderByDescending(p => p.CreatedAt)  // default: newest first
        };

        var totalCount = await query.CountAsync(cancellationToken);

        // Apply pagination — Skip = go past previous pages, Take = get this page's items
        // Áp dụng phân trang — Skip = bỏ qua các trang trước, Take = lấy items của trang này
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<Product>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }

    public async Task<Product?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
        => await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive, cancellationToken);

    public async Task<Product?> GetDetailAsync(Guid id, CancellationToken cancellationToken = default)
        => await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .Include(p => p.Reviews.Where(r => r.IsApproved))
                .ThenInclude(r => r.User)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

    public async Task<Product?> GetDetailBySlugAsync(string slug, CancellationToken cancellationToken = default)
        => await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .Include(p => p.Reviews.Where(r => r.IsApproved))
                .ThenInclude(r => r.User)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive, cancellationToken);

    public async Task<Product?> GetWithVariantsAsync(Guid id, CancellationToken cancellationToken = default)
        => await _context.Products
            .Include(p => p.Variants)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

    public async Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null, CancellationToken cancellationToken = default)
        => await _context.Products.AnyAsync(p =>
            p.Slug == slug && (excludeId == null || p.Id != excludeId.Value),
            cancellationToken);
}
