// ============================================================
// FILE: Common/Interfaces/Repositories/ICategoryRepository.cs
// MỤC ĐÍCH: Các truy vấn danh mục sản phẩm.
// ============================================================

using SportGearStore.Domain.Entities;

namespace SportGearStore.Application.Common.Interfaces.Repositories;

public interface ICategoryRepository : IGenericRepository<Category>
{
    Task<Category?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Category>> GetActiveAsync(CancellationToken cancellationToken = default);
}
