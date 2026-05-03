// ============================================================
// FILE: Middleware/ExceptionMiddleware.cs
// PURPOSE: Global exception handler — catches ALL unhandled exceptions
//          and converts them to clean JSON error responses.
//          Without this, exceptions leak stack traces to the client.
// MỤC ĐÍCH: Xử lý lỗi toàn cục — bắt TẤT CẢ exceptions chưa được xử lý
//           và chuyển chúng thành JSON error response sạch.
//           Không có cái này, exceptions sẽ lộ stack trace ra client.
//
// EXCEPTION → HTTP STATUS MAP / ÁNH XẠ EXCEPTION → HTTP STATUS:
//   ValidationException  → 400 Bad Request
//   NotFoundException    → 404 Not Found
//   ConflictException    → 409 Conflict
//   ForbiddenException   → 403 Forbidden
//   Any other exception  → 500 Internal Server Error
// ============================================================

using System.Net;
using System.Text.Json;
using FluentValidation;
using SportGearStore.Application.Common.Exceptions;

namespace SportGearStore.API.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context); // Pass the request to the next middleware
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var (statusCode, errors) = exception switch
        {
            // FluentValidation failures — return all field errors
            // Lỗi FluentValidation — trả về tất cả lỗi từng trường
            ValidationException validationEx => (
                HttpStatusCode.BadRequest,
                validationEx.Errors.Select(e => e.ErrorMessage).ToList()
            ),

            NotFoundException notFoundEx => (
                HttpStatusCode.NotFound,
                new List<string> { notFoundEx.Message }
            ),

            ConflictException conflictEx => (
                HttpStatusCode.Conflict,
                new List<string> { conflictEx.Message }
            ),

            ForbiddenException forbiddenEx => (
                HttpStatusCode.Forbidden,
                new List<string> { forbiddenEx.Message }
            ),

            // Any unexpected exception — expose message in dev for debugging
            _ => (
                HttpStatusCode.InternalServerError,
                new List<string> { exception.Message, exception.InnerException?.Message ?? "" }
            )
        };

        context.Response.StatusCode = (int)statusCode;

        var response = new
        {
            StatusCode = (int)statusCode,
            Errors = errors
        };

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}
