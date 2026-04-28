// ============================================================
// FILE: DependencyInjection.cs
// PURPOSE: Registers all Application layer services into the DI container.
//          Called once from Program.cs: builder.Services.AddApplication()
// MỤC ĐÍCH: Đăng ký tất cả services của Application layer vào DI container.
//           Được gọi một lần từ Program.cs: builder.Services.AddApplication()
//
// WHY A SEPARATE FILE? / TẠI SAO TÁCH FILE RIÊNG?
//   Keeps Program.cs clean. Each layer registers its own dependencies.
//   Giữ cho Program.cs sạch. Mỗi layer tự đăng ký dependencies của mình.
// ============================================================

using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using SportGearStore.Application.Common.Behaviors;
using SportGearStore.Application.Common.Mappings;

namespace SportGearStore.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Register AutoMapper — scans this assembly for all Profile classes
        // Đăng ký AutoMapper — quét assembly này để tìm tất cả Profile classes
        services.AddAutoMapper(cfg => cfg.AddMaps(typeof(MappingProfile).Assembly));

        // Register FluentValidation — scans this assembly for all AbstractValidator<T>
        // Đăng ký FluentValidation — quét assembly này để tìm tất cả AbstractValidator<T>
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        // Register MediatR — scans this assembly for all IRequestHandler<> implementations
        // Đăng ký MediatR — quét assembly này để tìm tất cả IRequestHandler<>
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());

            // Add pipeline behaviors in ORDER — they wrap the handler like middleware
            // Thêm pipeline behaviors theo THỨ TỰ — chúng bọc handler như middleware
            // Request → Logging → Validation → Handler → Response
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        });

        return services;
    }
}
