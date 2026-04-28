// ============================================================
// FILE: Features/Auth/Queries/Login/LoginHandler.cs
// PURPOSE: Verifies credentials and returns a JWT token.
// MỤC ĐÍCH: Xác minh thông tin đăng nhập và trả về JWT token.
//
// FLOW / LUỒNG XỬ LÝ:
//   1. Find user by email
//   2. Verify password hash
//   3. Check user is active
//   4. Generate and return JWT token
//
// SECURITY NOTE / LƯU Ý BẢO MẬT:
//   We return the same error message whether email or password is wrong.
//   This prevents attackers from knowing which one failed (user enumeration attack).
//   Chúng ta trả về cùng một thông báo lỗi dù email hay mật khẩu sai.
//   Điều này ngăn kẻ tấn công biết cái nào sai (tấn công liệt kê người dùng).
// ============================================================

using MediatR;
using SportGearStore.Application.Common.Exceptions;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Application.Common.Interfaces.Services;
using SportGearStore.Application.Features.Auth.DTOs;

namespace SportGearStore.Application.Features.Auth.Queries.Login;

public class LoginHandler : IRequestHandler<LoginQuery, AuthResponseDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;

    public LoginHandler(IUnitOfWork unitOfWork, IJwtService jwtService)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
    }

    public async Task<AuthResponseDto> Handle(LoginQuery request, CancellationToken cancellationToken)
    {
        // 1. Find user by email (case-insensitive)
        //    Tìm user theo email (không phân biệt hoa thường)
        var user = await _unitOfWork.Users.GetByEmailAsync(
            request.Email.ToLowerInvariant(), cancellationToken);

        // 2. Verify password — same error message for security
        //    Xác minh mật khẩu — cùng thông báo lỗi để bảo mật
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new ForbiddenException("Invalid email or password.");

        // 3. Check account is not disabled
        //    Kiểm tra tài khoản không bị vô hiệu hóa
        if (!user.IsActive)
            throw new ForbiddenException("Your account has been disabled.");

        // 4. Load roles and generate token
        //    Load roles và tạo token
        var userWithRoles = await _unitOfWork.Users.GetWithRolesAsync(user.Id, cancellationToken);
        var roles = userWithRoles!.UserRoles.Select(ur => ur.Role.Name).ToList();

        var token = _jwtService.GenerateToken(user, roles);
        var expiresAt = _jwtService.GetTokenExpiry();

        return new AuthResponseDto(
            Token: token,
            ExpiresAt: expiresAt,
            User: new UserInfoDto(user.Id, user.Email, user.FirstName, user.LastName, roles)
        );
    }
}
