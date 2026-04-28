// ============================================================
// FILE: Features/Products/Commands/DeleteProduct/DeleteProductCommand.cs
// PURPOSE: Soft-delete a product (sets IsActive = false).
//          We never hard-delete products because existing orders reference them.
// MỤC ĐÍCH: Xóa mềm sản phẩm (đặt IsActive = false).
//           Chúng ta không bao giờ xóa cứng vì các đơn hàng hiện tại vẫn tham chiếu đến chúng.
// ============================================================

using MediatR;

namespace SportGearStore.Application.Features.Products.Commands.DeleteProduct;

public record DeleteProductCommand(Guid Id) : IRequest;
