// ============================================================
// FILE: Entities/Review.cs
// PURPOSE: Represents a customer review/rating for a product.
//          IsApproved allows admin to moderate before publishing.
// MỤC ĐÍCH: Đại diện cho đánh giá/xếp hạng của khách hàng cho sản phẩm.
//           IsApproved cho phép admin kiểm duyệt trước khi công khai.
// ============================================================

using SportGearStore.Domain.Common;

namespace SportGearStore.Domain.Entities;

public class Review : BaseEntity
{
    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    // Rating from 1 (worst) to 5 (best)
    // Đánh giá từ 1 (tệ nhất) đến 5 (tốt nhất)
    public int Rating { get; set; }

    public string? Comment { get; set; }

    // Admin must approve before the review is visible to other customers
    // Admin phải duyệt trước khi đánh giá hiển thị với khách hàng khác
    public bool IsApproved { get; set; } = false;
}
