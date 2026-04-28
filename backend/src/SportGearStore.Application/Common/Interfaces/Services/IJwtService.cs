// ============================================================
// FILE: Common/Interfaces/Services/IJwtService.cs
// PURPOSE: Contract for generating and validating JWT tokens.
//          Implementation lives in Infrastructure — Application
//          only depends on this interface.
// MỤC ĐÍCH: Hợp đồng để tạo và xác thực JWT token.
//           Triển khai nằm trong Infrastructure — Application
//           chỉ phụ thuộc vào interface này.
// ============================================================

using SportGearStore.Domain.Entities;

namespace SportGearStore.Application.Common.Interfaces.Services;

public interface IJwtService
{
    // Generate a signed JWT token for the given user
    // Tạo JWT token đã ký cho người dùng đã cho
    string GenerateToken(User user, IEnumerable<string> roles);

    DateTime GetTokenExpiry();
}
