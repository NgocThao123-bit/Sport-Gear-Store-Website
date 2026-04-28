// ============================================================
// FILE: Features/Products/Commands/DeleteProduct/DeleteProductHandler.cs
// MỤC ĐÍCH: Xử lý xóa mềm sản phẩm.
// ============================================================

using MediatR;
using SportGearStore.Application.Common.Exceptions;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Application.Features.Products.Commands.DeleteProduct;

public class DeleteProductHandler : IRequestHandler<DeleteProductCommand>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteProductHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(request.Id, cancellationToken);
        if (product == null)
            throw new NotFoundException(nameof(Product), request.Id);

        // Soft delete: hide the product from customers without losing order history
        // Xóa mềm: ẩn sản phẩm khỏi khách hàng mà không mất lịch sử đơn hàng
        product.IsActive = false;
        product.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Products.Update(product);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
