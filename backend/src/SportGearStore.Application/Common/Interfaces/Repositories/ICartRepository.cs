// ============================================================
// FILE: Common/Interfaces/Repositories/ICartRepository.cs
// MỤC ĐÍCH: Các truy vấn giỏ hàng.
// ============================================================

using SportGearStore.Domain.Entities;

namespace SportGearStore.Application.Common.Interfaces.Repositories;

public interface ICartRepository
{
    // Load cart with all its items, product info, and variant info
    // Load giỏ hàng với tất cả items, thông tin sản phẩm và biến thể
    Task<Cart?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task AddAsync(Cart cart, CancellationToken cancellationToken = default);
    Task AddItemAsync(CartItem item, CancellationToken cancellationToken = default);
    void Update(Cart cart);
}
