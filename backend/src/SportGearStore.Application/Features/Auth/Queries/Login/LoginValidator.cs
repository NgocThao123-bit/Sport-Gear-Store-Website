// ============================================================
// FILE: Features/Auth/Queries/Login/LoginValidator.cs
// MỤC ĐÍCH: Xác thực đầu vào của LoginQuery.
// ============================================================

using FluentValidation;

namespace SportGearStore.Application.Features.Auth.Queries.Login;

public class LoginValidator : AbstractValidator<LoginQuery>
{
    public LoginValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.");
    }
}
