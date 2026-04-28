// ============================================================
// FILE: Entities/User.cs
// PURPOSE: Represents a registered user (customer or admin).
// MỤC ĐÍCH: Đại diện cho người dùng đã đăng ký (khách hàng hoặc admin).
// ORDER: Create after Role.cs
//        Tạo sau Role.cs
// ============================================================

using SportGearStore.Domain.Common;

namespace SportGearStore.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;

    // Stored as a BCrypt hash — NEVER store plain text passwords
    // Lưu dưới dạng BCrypt hash — KHÔNG BAO GIỜ lưu mật khẩu dạng plain text
    public string PasswordHash { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    public string? Phone { get; set; }
    public string? Address { get; set; }

    // Soft delete: set to false instead of deleting the record
    // Xóa mềm: đặt thành false thay vì xóa bản ghi
    public bool IsActive { get; set; } = true;

    // Navigation properties
    // Thuộc tính điều hướng (dùng để EF Core load related data)
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public Cart? Cart { get; set; }
}
