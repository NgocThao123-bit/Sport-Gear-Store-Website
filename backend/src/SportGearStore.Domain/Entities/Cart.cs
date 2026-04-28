// ============================================================
// FILE: Entities/Cart.cs
// PURPOSE: Represents a user's shopping cart stored in the database.
//          Storing in DB (not browser localStorage) means the cart
//          persists when user logs out and back in.
// MỤC ĐÍCH: Đại diện cho giỏ hàng của người dùng được lưu trong database.
//           Lưu trong DB (không phải localStorage) giúp giỏ hàng
//           không bị mất khi đăng xuất rồi đăng nhập lại.
// ============================================================

using SportGearStore.Domain.Common;

namespace SportGearStore.Domain.Entities;

public class Cart : BaseEntity
{
    // One cart belongs to one user (1-to-1 relationship)
    // Một giỏ hàng thuộc về một người dùng (quan hệ 1-1)
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
}
