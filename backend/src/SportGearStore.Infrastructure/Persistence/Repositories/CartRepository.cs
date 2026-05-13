using Microsoft.EntityFrameworkCore;
using SportGearStore.Application.Common.Interfaces.Repositories;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Infrastructure.Persistence.Repositories;

public class CartRepository : ICartRepository
{
    private readonly AppDbContext _context;

    public CartRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Cart?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
        => await _context.Carts
            .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p.Images)
            .Include(c => c.Items)
                .ThenInclude(i => i.ProductVariant)
            .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);

    public async Task AddAsync(Cart cart, CancellationToken cancellationToken = default)
        => await _context.Carts.AddAsync(cart, cancellationToken);

    public async Task AddItemAsync(CartItem item, CancellationToken cancellationToken = default)
        => await _context.CartItems.AddAsync(item, cancellationToken);

    public void Update(Cart cart)
        => _context.Carts.Update(cart);

    // Explicitly remove a single CartItem from the DbSet
    // Xóa tường minh một CartItem khỏi DbSet
    public void RemoveItem(CartItem item)
        => _context.CartItems.Remove(item);

    // Explicitly remove multiple CartItems in one call (e.g. clear cart on checkout)
    // Xóa tường minh nhiều CartItems trong một lần gọi (vd: xóa giỏ khi thanh toán)
    public void RemoveItems(IEnumerable<CartItem> items)
        => _context.CartItems.RemoveRange(items);
}
