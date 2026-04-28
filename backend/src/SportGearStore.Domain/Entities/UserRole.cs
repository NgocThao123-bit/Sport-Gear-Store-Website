// ============================================================
// FILE: Entities/UserRole.cs
// PURPOSE: Junction table — links a User to a Role (many-to-many).
//          One user can have multiple roles.
// MỤC ĐÍCH: Bảng trung gian — liên kết User với Role (nhiều-nhiều).
//           Một user có thể có nhiều role.
// ORDER: Create after User.cs and Role.cs
//        Tạo sau User.cs và Role.cs
// ============================================================

namespace SportGearStore.Domain.Entities;

public class UserRole
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public int RoleId { get; set; }
    public Role Role { get; set; } = null!;
}
