// ============================================================
// FILE: Features/Auth/DTOs/AuthDtos.cs
// PURPOSE: Data shapes for authentication requests and responses.
// MỤC ĐÍCH: Cấu trúc dữ liệu cho các request và response xác thực.
// ============================================================

namespace SportGearStore.Application.Features.Auth.DTOs;

// Response returned after successful login or register
// Response trả về sau khi đăng nhập hoặc đăng ký thành công
public record AuthResponseDto(
    string Token,
    DateTime ExpiresAt,
    UserInfoDto User
);

public record UserInfoDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    IEnumerable<string> Roles
);
