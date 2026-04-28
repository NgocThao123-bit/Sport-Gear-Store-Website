// ============================================================
// FILE: Entities/Role.cs
// PURPOSE: Represents a user role (e.g. Customer, Admin).
//          Roles control what actions a user is allowed to do.
// MỤC ĐÍCH: Đại diện cho vai trò người dùng (VD: Customer, Admin).
//           Roles kiểm soát những hành động người dùng được phép thực hiện.
// ORDER: Create before User, because User references Role via UserRoles.
//        Tạo trước User, vì User tham chiếu Role qua UserRoles.
// ============================================================

namespace SportGearStore.Domain.Entities;

public class Role
{
    public int Id { get; set; }

    // Role name: "Customer" or "Admin"
    // Tên role: "Customer" hoặc "Admin"
    public string Name { get; set; } = string.Empty;

    // Navigation property: one role can belong to many users
    // Navigation property: một role có thể thuộc về nhiều user
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
