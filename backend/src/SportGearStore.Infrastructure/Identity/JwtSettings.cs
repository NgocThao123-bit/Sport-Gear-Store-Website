// ============================================================
// FILE: Identity/JwtSettings.cs
// PURPOSE: Maps to the "JwtSettings" section in appsettings.json.
//          Strongly-typed config is safer than reading raw strings.
// MỤC ĐÍCH: Ánh xạ với phần "JwtSettings" trong appsettings.json.
//           Config có kiểu mạnh an toàn hơn đọc chuỗi thô.
// ============================================================

namespace SportGearStore.Infrastructure.Identity;

public class JwtSettings
{
    // Secret key used to sign/verify the token — must be at least 32 chars
    // Secret key dùng để ký/xác minh token — phải ít nhất 32 ký tự
    public string SecretKey { get; set; } = string.Empty;

    // e.g. "SportGearStore" — identifies who issued the token
    // VD: "SportGearStore" — xác định ai đã cấp token
    public string Issuer { get; set; } = string.Empty;

    // e.g. "SportGearStoreClient" — identifies who the token is for
    // VD: "SportGearStoreClient" — xác định token dành cho ai
    public string Audience { get; set; } = string.Empty;

    // Token lifetime in minutes (e.g. 60 = 1 hour)
    // Thời gian sống của token tính bằng phút (VD: 60 = 1 giờ)
    public int ExpiryMinutes { get; set; } = 60;
}
