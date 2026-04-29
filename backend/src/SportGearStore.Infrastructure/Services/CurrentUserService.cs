// ============================================================
// FILE: Services/CurrentUserService.cs
// PURPOSE: Reads the currently authenticated user's data from
//          the JWT token that was validated by ASP.NET Core middleware.
//          Handlers call this instead of touching HttpContext directly.
// MỤC ĐÍCH: Đọc dữ liệu người dùng đang xác thực từ JWT token
//           đã được ASP.NET Core middleware xác minh.
//           Handlers gọi cái này thay vì truy cập HttpContext trực tiếp.
// ============================================================

using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using SportGearStore.Application.Common.Interfaces.Services;

namespace SportGearStore.Infrastructure.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    // Read the user's Id from the NameIdentifier claim in the JWT token
    // Đọc Id của user từ claim NameIdentifier trong JWT token
    public Guid? UserId
    {
        get
        {
            var value = _httpContextAccessor.HttpContext?.User
                .FindFirstValue(ClaimTypes.NameIdentifier);

            return Guid.TryParse(value, out var id) ? id : null;
        }
    }

    public bool IsAuthenticated
        => _httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated ?? false;

    // Check if the user has the "Admin" role claim in their token
    // Kiểm tra user có claim role "Admin" trong token không
    public bool IsAdmin
        => _httpContextAccessor.HttpContext?.User.IsInRole("Admin") ?? false;
}
