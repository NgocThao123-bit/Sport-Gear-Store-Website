using Microsoft.EntityFrameworkCore;
using SportGearStore.Application.Common.Interfaces.Repositories;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Infrastructure.Persistence.Repositories;

public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
{
    public CategoryRepository(AppDbContext context) : base(context) { }

    public async Task<Category?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
        => await _context.Categories
            .FirstOrDefaultAsync(c => c.Slug == slug && c.IsActive, cancellationToken);

    public async Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null, CancellationToken cancellationToken = default)
        => await _context.Categories.AnyAsync(c =>
            c.Slug == slug && (excludeId == null || c.Id != excludeId.Value),
            cancellationToken);

    public async Task<IReadOnlyList<Category>> GetActiveAsync(CancellationToken cancellationToken = default)
        => await _context.Categories
            .Where(c => c.IsActive)
            .Include(c => c.Products.Where(p => p.IsActive))
            .OrderBy(c => c.Name)
            .ToListAsync(cancellationToken);
}
