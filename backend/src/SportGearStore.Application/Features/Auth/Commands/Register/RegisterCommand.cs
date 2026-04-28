// ============================================================
// FILE: Features/Auth/Commands/Register/RegisterCommand.cs
// PURPOSE: Represents the "register a new user" use case input.
//          IRequest<T> means this command returns an AuthResponseDto.
// MỤC ĐÍCH: Đại diện cho input của use case "đăng ký người dùng mới".
//           IRequest<T> nghĩa là command này trả về AuthResponseDto.
// ============================================================

using MediatR;
using SportGearStore.Application.Features.Auth.DTOs;

namespace SportGearStore.Application.Features.Auth.Commands.Register;

// record = immutable object — perfect for commands (data-only, no behavior)
// record = đối tượng bất biến — hoàn hảo cho commands (chỉ dữ liệu, không có hành vi)
public record RegisterCommand(
    string FirstName,
    string LastName,
    string Email,
    string Password
) : IRequest<AuthResponseDto>;
