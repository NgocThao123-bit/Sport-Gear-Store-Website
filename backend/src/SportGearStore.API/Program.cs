// ============================================================
// FILE: Program.cs
// PURPOSE: Entry point of the ASP.NET Core application.
//          Registers services (DI) and configures the HTTP pipeline.
// MỤC ĐÍCH: Điểm vào của ứng dụng ASP.NET Core.
//           Đăng ký services (DI) và cấu hình HTTP pipeline.
//
// ORDER OF MIDDLEWARE MATTERS / THỨ TỰ MIDDLEWARE QUAN TRỌNG:
//   Request comes in → goes through each middleware top to bottom
//   Response goes back → bottom to top
//   Request đến → đi qua từng middleware từ trên xuống dưới
//   Response trả về → từ dưới lên trên
// ============================================================

using Scalar.AspNetCore;
using Serilog;
using SportGearStore.API.Middleware;
using SportGearStore.Application;
using SportGearStore.Infrastructure;

// ── 1. Configure Serilog before anything else ───────────────
// Cấu hình Serilog trước mọi thứ khác
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/sportgear-.txt", rollingInterval: RollingInterval.Day)
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting SportGearStore API...");

    var builder = WebApplication.CreateBuilder(args);

    // Use Serilog instead of the default ASP.NET Core logger
    // Dùng Serilog thay vì logger mặc định của ASP.NET Core
    builder.Host.UseSerilog((context, services, config) =>
        config.ReadFrom.Configuration(context.Configuration)
              .WriteTo.Console()
              .WriteTo.File("logs/sportgear-.txt", rollingInterval: RollingInterval.Day));

    // ── 2. Register services ─────────────────────────────────
    // Each layer registers its own services via its DependencyInjection.cs
    // Mỗi layer đăng ký services của mình qua DependencyInjection.cs
    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(builder.Configuration);

    builder.Services.AddControllers();
    builder.Services.AddOpenApi();

    // ── 3. CORS — allow React frontend to call the API ───────
    // CORS — cho phép React frontend gọi API
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
            policy.WithOrigins("http://localhost:5173")  // Vite default port
                  .AllowAnyHeader()
                  .AllowAnyMethod());
    });

    var app = builder.Build();

    // ── 4. HTTP Pipeline ─────────────────────────────────────
    if (app.Environment.IsDevelopment())
    {
        // MapOpenApi generates the spec at /openapi/v1.json
        // MapScalarApiReference serves the interactive UI at /scalar/v1
        // MapOpenApi tạo spec tại /openapi/v1.json
        // MapScalarApiReference phục vụ giao diện tương tác tại /scalar/v1
        app.MapOpenApi();
        app.MapScalarApiReference();
    }

    app.UseSerilogRequestLogging(); // Log every HTTP request automatically

    // ExceptionMiddleware must be FIRST so it catches all errors from every layer below
    // ExceptionMiddleware phải là ĐẦU TIÊN để bắt tất cả lỗi từ mọi layer phía dưới
    app.UseMiddleware<ExceptionMiddleware>();

    app.UseHttpsRedirection();
    app.UseCors("AllowFrontend");

    app.UseAuthentication(); // Read JWT token from request header
                             // Đọc JWT token từ header request
    app.UseAuthorization();  // Check if user has permission for this endpoint
                             // Kiểm tra user có quyền với endpoint này không

    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly.");
}
finally
{
    Log.CloseAndFlush();
}
