// ============================================================
// FILE: Features/Products/Commands/UpdateProduct/UpdateProductHandler.cs
// MỤC ĐÍCH: Xử lý logic nghiệp vụ cập nhật sản phẩm.
// ============================================================

using MediatR;
using SportGearStore.Application.Common.Exceptions;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Application.Features.Products.Commands.UpdateProduct;

public class UpdateProductHandler : IRequestHandler<UpdateProductCommand>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateProductHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(request.Id, cancellationToken);
        if (product == null)
            throw new NotFoundException(nameof(Product), request.Id);

        // Update fields — EF Core tracks these changes automatically
        // Cập nhật các trường — EF Core tự động theo dõi thay đổi này
        product.Name = request.Name;
        product.Brand = request.Brand;
        product.Description = request.Description;
        product.Price = request.Price;
        product.SalePrice = request.SalePrice;
        product.CategoryId = request.CategoryId;
        product.IsActive = request.IsActive;
        product.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Products.Update(product);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
