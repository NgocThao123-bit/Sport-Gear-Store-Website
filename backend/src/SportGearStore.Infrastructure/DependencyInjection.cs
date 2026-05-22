// ============================================================
// FILE: DependencyInjection.cs
// PURPOSE: Registers all Infrastructure services into the DI container.
//          Called once from Program.cs: builder.Services.AddInfrastructure(config)
// MỤC ĐÍCH: Đăng ký tất cả services của Infrastructure vào DI container.
//           Được gọi một lần từ Program.cs: builder.Services.AddInfrastructure(config)
// ============================================================

using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Application.Common.Interfaces.Services;
using SportGearStore.Infrastructure.Identity;
using SportGearStore.Infrastructure.Persistence;
using SportGearStore.Infrastructure.Services;

namespace SportGearStore.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Register SQL Server database connection
        // Đăng ký kết nối database SQL Server
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName)));

        // Register UnitOfWork — scoped means one instance per HTTP request
        // Đăng ký UnitOfWork — scoped nghĩa là một instance cho mỗi HTTP request
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Register JwtSettings from appsettings.json
        // Đăng ký JwtSettings từ appsettings.json
        services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));

        // Register services — scoped = one instance per request
        // Đăng ký services — scoped = một instance cho mỗi request
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IPaymentService, MockPaymentService>();

        // IHttpContextAccessor lets us read the HTTP request inside services
        // IHttpContextAccessor cho phép chúng ta đọc HTTP request bên trong services
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();

        // ── JWT Authentication ───────────────────────────────
        // Tell ASP.NET Core to validate incoming JWT tokens automatically
        // Nói với ASP.NET Core tự động xác thực JWT tokens đến
        var jwtSettings = configuration.GetSection("JwtSettings").Get<JwtSettings>()!;
        var key = Encoding.UTF8.GetBytes(jwtSettings.SecretKey);

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidateAudience = true,
                ValidAudience = jwtSettings.Audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero  // No tolerance on token expiry
                                           // Không có dung sai về hạn token
            };
        });

        services.AddAuthorization();

        return services;
    }
}
