// ============================================================
// FILE: Common/Behaviors/ValidationBehavior.cs
// PURPOSE: MediatR pipeline behavior that runs FluentValidation
//          on every Command/Query that has a validator registered.
//          If validation fails, it throws ValidationException
//          BEFORE the handler ever runs — no bad data enters the system.
// MỤC ĐÍCH: Pipeline behavior của MediatR chạy FluentValidation
//           trên mọi Command/Query có validator được đăng ký.
//           Nếu validation thất bại, nó ném ValidationException
//           TRƯỚC KHI handler chạy — không có dữ liệu xấu vào hệ thống.
//
// PIPELINE ORDER / THỨ TỰ PIPELINE:
//   Request → LoggingBehavior → ValidationBehavior → Handler → Response
// ============================================================

using FluentValidation;
using MediatR;

namespace SportGearStore.Application.Common.Behaviors;

public class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    // DI injects ALL validators registered for this request type
    // DI inject TẤT CẢ validator được đăng ký cho kiểu request này
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        // Skip if no validators exist for this request
        // Bỏ qua nếu không có validator nào cho request này
        if (!_validators.Any())
            return await next();

        // Run all validators and collect failures
        // Chạy tất cả validators và thu thập lỗi
        var context = new ValidationContext<TRequest>(request);

        var validationResults = await Task.WhenAll(
            _validators.Select(v => v.ValidateAsync(context, cancellationToken)));

        var failures = validationResults
            .SelectMany(r => r.Errors)
            .Where(f => f != null)
            .ToList();

        // If any validation rule failed, throw — handler is never called
        // Nếu có quy tắc validation nào thất bại, throw — handler không bao giờ được gọi
        if (failures.Count != 0)
            throw new ValidationException(failures);

        return await next();
    }
}
