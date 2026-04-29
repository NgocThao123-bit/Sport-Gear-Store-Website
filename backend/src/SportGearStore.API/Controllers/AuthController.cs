// ============================================================
// FILE: Controllers/AuthController.cs
// PURPOSE: Handles user registration and login endpoints.
// MỤC ĐÍCH: Xử lý các endpoint đăng ký và đăng nhập người dùng.
//
// ENDPOINTS:
//   POST /api/auth/register  → public
//   POST /api/auth/login     → public
// ============================================================

using MediatR;
using Microsoft.AspNetCore.Mvc;
using SportGearStore.Application.Features.Auth.Commands.Register;
using SportGearStore.Application.Features.Auth.Queries.Login;

namespace SportGearStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]  // → /api/auth
public class AuthController : ControllerBase
{
    // ISender is the MediatR interface for sending commands/queries
    // ISender là interface MediatR để gửi commands/queries
    private readonly ISender _sender;

    public AuthController(ISender sender)
    {
        _sender = sender;
    }

    // POST /api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] RegisterCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);

        // 201 Created — new resource was successfully created
        // 201 Created — tài nguyên mới đã được tạo thành công
        return CreatedAtAction(nameof(Register), result);
    }

    // POST /api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginQuery query,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(query, cancellationToken);
        return Ok(result);
    }
}
