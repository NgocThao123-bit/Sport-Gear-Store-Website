// ============================================================
// FILE: Features/Auth/Commands/Register/RegisterHandler.cs
// PURPOSE: Executes the registration business logic.
//          MediatR routes RegisterCommand to this handler automatically.
// MỤC ĐÍCH: Thực thi logic nghiệp vụ đăng ký.
//           MediatR định tuyến RegisterCommand đến handler này tự động.
//
// FLOW / LUỒNG XỬ LÝ:
//   1. Check email not already taken
//   2. Hash password
//   3. Create user + assign Customer role
//   4. Save to DB
//   5. Generate JWT token and return
// ============================================================

using MediatR;
using SportGearStore.Application.Common.Exceptions;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Application.Common.Interfaces.Services;
using SportGearStore.Application.Features.Auth.DTOs;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Application.Features.Auth.Commands.Register;

public class RegisterHandler : IRequestHandler<RegisterCommand, AuthResponseDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;

    public RegisterHandler(IUnitOfWork unitOfWork, IJwtService jwtService)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
    }

    public async Task<AuthResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // 1. Check if email already exists
        //    Kiểm tra xem email đã tồn tại chưa
        var emailExists = await _unitOfWork.Users.EmailExistsAsync(request.Email, cancellationToken);
        if (emailExists)
            throw new ConflictException($"Email '{request.Email}' is already registered.");

        // 2. Hash the password using BCrypt
        //    Hash mật khẩu bằng BCrypt
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // 3. Create the user entity
        //    Tạo entity người dùng
        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email.ToLowerInvariant(), // Always store email in lowercase
            PasswordHash = passwordHash,              // Store hash, never plain text
            IsActive = true
        };

        // 4. Assign the default "Customer" role (RoleId = 1)
        //    Gán role mặc định "Customer" (RoleId = 1)
        user.UserRoles.Add(new UserRole { RoleId = 1 });

        await _unitOfWork.Users.AddAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // 5. Generate JWT token
        //    Tạo JWT token
        var roles = new[] { "Customer" };
        var token = _jwtService.GenerateToken(user, roles);
        var expiresAt = _jwtService.GetTokenExpiry();

        return new AuthResponseDto(
            Token: token,
            ExpiresAt: expiresAt,
            User: new UserInfoDto(user.Id, user.Email, user.FirstName, user.LastName, roles)
        );
    }
}
