// ============================================================
// FILE: Common/Interfaces/Services/ICurrentUserService.cs
// PURPOSE: Extracts the currently logged-in user's Id and roles
//          from the JWT token in the HTTP request.
//          Handlers use this to check authorization without
//          touching HttpContext directly.
// MỤC ĐÍCH: Lấy Id và roles của người dùng đang đăng nhập
//           từ JWT token trong HTTP request.
//           Handlers dùng cái này để kiểm tra quyền mà không
//           cần truy cập HttpContext trực tiếp.
// ============================================================

namespace SportGearStore.Application.Common.Interfaces.Services;

public interface ICurrentUserService
{
    // Returns null if the user is not authenticated
    // Trả về null nếu người dùng chưa xác thực
    Guid? UserId { get; }

    bool IsAuthenticated { get; }
    bool IsAdmin { get; }
}
