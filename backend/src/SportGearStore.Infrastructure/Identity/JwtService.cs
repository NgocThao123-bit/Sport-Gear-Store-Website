// ============================================================
// FILE: Identity/JwtService.cs
// PURPOSE: Implements IJwtService — generates a signed JWT token
//          containing the user's Id and roles as claims.
// MỤC ĐÍCH: Triển khai IJwtService — tạo JWT token đã ký
//           chứa Id và roles của user dưới dạng claims.
//
// HOW JWT WORKS / CÁCH JWT HOẠT ĐỘNG:
//   1. Server creates a payload: { userId, roles, expiry }
//   2. Server signs it with SecretKey → produces a token string
//   3. Client sends token in every request header: "Authorization: Bearer <token>"
//   4. Server verifies signature — if valid, trusts the claims inside
//
//   1. Server tạo payload: { userId, roles, expiry }
//   2. Server ký bằng SecretKey → tạo ra chuỗi token
//   3. Client gửi token trong header mỗi request: "Authorization: Bearer <token>"
//   4. Server xác minh chữ ký — nếu hợp lệ, tin tưởng claims bên trong
// ============================================================

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SportGearStore.Application.Common.Interfaces.Services;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Infrastructure.Identity;

public class JwtService : IJwtService
{
    private readonly JwtSettings _settings;

    public JwtService(IOptions<JwtSettings> settings)
    {
        _settings = settings.Value;
    }

    public string GenerateToken(User user, IEnumerable<string> roles)
    {
        // Claims = pieces of information baked into the token
        // Claims = các thông tin được nhúng vào trong token
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.GivenName, user.FirstName),
            new(ClaimTypes.Surname, user.LastName),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // unique token id
        };

        // Add a claim for each role (e.g. "Customer", "Admin")
        // Thêm một claim cho mỗi role
        foreach (var role in roles)
            claims.Add(new Claim(ClaimTypes.Role, role));

        // Create signing credentials using HMAC-SHA256 algorithm
        // Tạo thông tin ký bằng thuật toán HMAC-SHA256
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _settings.Issuer,
            audience: _settings.Audience,
            claims: claims,
            expires: GetTokenExpiry(),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public DateTime GetTokenExpiry()
        => DateTime.UtcNow.AddMinutes(_settings.ExpiryMinutes);
}
