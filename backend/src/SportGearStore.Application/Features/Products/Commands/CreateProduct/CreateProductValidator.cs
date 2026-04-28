// ============================================================
// FILE: Features/Products/Commands/CreateProduct/CreateProductValidator.cs
// MỤC ĐÍCH: Xác thực dữ liệu đầu vào khi tạo sản phẩm.
// ============================================================

using FluentValidation;

namespace SportGearStore.Application.Features.Products.Commands.CreateProduct;

public class CreateProductValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Product name is required.")
            .MaximumLength(200);

        RuleFor(x => x.Brand)
            .NotEmpty().WithMessage("Brand is required.")
            .MaximumLength(100);

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0.");

        RuleFor(x => x.SalePrice)
            .LessThan(x => x.Price)
            .When(x => x.SalePrice.HasValue)
            .WithMessage("Sale price must be less than the original price.");

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("Category is required.");
    }
}
