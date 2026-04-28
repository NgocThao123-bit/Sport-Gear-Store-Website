// ============================================================
// FILE: Features/Auth/Commands/Register/RegisterValidator.cs
// PURPOSE: Validates RegisterCommand fields before the handler runs.
//          ValidationBehavior in the pipeline calls this automatically.
// MỤC ĐÍCH: Xác thực các trường của RegisterCommand trước khi handler chạy.
//           ValidationBehavior trong pipeline gọi cái này tự động.
// ============================================================

using FluentValidation;

namespace SportGearStore.Application.Features.Auth.Commands.Register;

public class RegisterValidator : AbstractValidator<RegisterCommand>
{
    public RegisterValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required. / Tên là bắt buộc.")
            .MaximumLength(50);

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required. / Họ là bắt buộc.")
            .MaximumLength(50);

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required. / Email là bắt buộc.")
            .EmailAddress().WithMessage("Invalid email format. / Định dạng email không hợp lệ.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required. / Mật khẩu là bắt buộc.")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters. / Mật khẩu phải ít nhất 8 ký tự.")
            .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
            .Matches("[0-9]").WithMessage("Password must contain at least one number.");
    }
}
