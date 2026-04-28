// ============================================================
// FILE: Common/Behaviors/LoggingBehavior.cs
// PURPOSE: MediatR pipeline behavior that automatically logs every
//          incoming Command/Query — name, execution time, and errors.
//          You never need to add logging inside individual handlers.
// MỤC ĐÍCH: Pipeline behavior của MediatR tự động log mọi
//           Command/Query — tên, thời gian thực thi và lỗi.
//           Bạn không bao giờ cần thêm logging bên trong từng handler.
//
// PIPELINE ORDER / THỨ TỰ PIPELINE:
//   Request → LoggingBehavior → ValidationBehavior → Handler → Response
// ============================================================

using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace SportGearStore.Application.Common.Behaviors;

public class LoggingBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var stopwatch = Stopwatch.StartNew();

        _logger.LogInformation("Handling {RequestName}", requestName);

        try
        {
            var response = await next();

            stopwatch.Stop();
            _logger.LogInformation(
                "Handled {RequestName} in {ElapsedMs}ms",
                requestName,
                stopwatch.ElapsedMilliseconds);

            return response;
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            _logger.LogError(
                ex,
                "Error handling {RequestName} after {ElapsedMs}ms",
                requestName,
                stopwatch.ElapsedMilliseconds);

            throw; // Re-throw so the global exception middleware handles it
                   // Re-throw để middleware xử lý lỗi toàn cục bắt lấy
        }
    }
}
