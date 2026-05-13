// ============================================================
// FILE: Features/Orders/Commands/CreateOrder/CreateOrderHandler.cs
// PURPOSE: Checkout logic — the most important handler in the system.
// MỤC ĐÍCH: Logic thanh toán — handler quan trọng nhất trong hệ thống.
//
// FLOW / LUỒNG XỬ LÝ:
//   1. Load user's cart
//   2. Validate cart is not empty
//   3. Build Order + OrderItems (snapshot prices and names)
//   4. Reduce stock for each variant
//   5. Clear the cart
//   6. Save ALL in one transaction (UnitOfWork)
// ============================================================

using MediatR;
using SportGearStore.Application.Common.Exceptions;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Domain.Entities;
using SportGearStore.Domain.Enums;

namespace SportGearStore.Application.Features.Orders.Commands.CreateOrder;

public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateOrderHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        // 1. Load cart
        var cart = await _unitOfWork.Carts.GetByUserIdAsync(request.UserId, cancellationToken);
        if (cart == null || !cart.Items.Any())
            throw new ConflictException("Cannot create an order with an empty cart.");

        // 2. Build order
        var order = new Order
        {
            UserId = request.UserId,
            OrderNumber = GenerateOrderNumber(),
            Status = OrderStatus.Pending,
            PaymentStatus = PaymentStatus.Unpaid,
            ShippingAddress = request.ShippingAddress,
            PaymentMethod = request.PaymentMethod,
            Notes = request.Notes
        };

        decimal subTotal = 0;

        // 3. Create order items — snapshot all prices and names NOW
        //    Tạo order items — snapshot tất cả giá và tên NGAY BÂY GIỜ
        foreach (var cartItem in cart.Items)
        {
            var product = cartItem.Product;
            var variantInfo = cartItem.ProductVariant != null
                ? $"Size: {cartItem.ProductVariant.Size} | Color: {cartItem.ProductVariant.Color}"
                : null;

            var mainImage = product.Images.FirstOrDefault(i => i.IsMain)?.ImageUrl
                          ?? product.Images.FirstOrDefault()?.ImageUrl;

            var orderItem = new OrderItem
            {
                ProductId = cartItem.ProductId,
                ProductVariantId = cartItem.ProductVariantId,
                ProductName = product.Name,      // Snapshot
                ProductImageUrl = mainImage,      // Snapshot
                VariantInfo = variantInfo,        // Snapshot
                Quantity = cartItem.Quantity,
                UnitPrice = cartItem.UnitPrice,   // Snapshot
                TotalPrice = cartItem.UnitPrice * cartItem.Quantity
            };

            order.Items.Add(orderItem);
            subTotal += orderItem.TotalPrice;

            // 4. Reduce stock
            //    Giảm tồn kho
            if (cartItem.ProductVariant != null)
                cartItem.ProductVariant.Stock -= cartItem.Quantity;
        }

        order.SubTotal = subTotal;
        order.ShippingFee = CalculateShippingFee(subTotal);
        order.TotalAmount = subTotal + order.ShippingFee;

        await _unitOfWork.Orders.AddAsync(order, cancellationToken);

        // 5. Clear the cart after checkout — use RemoveItems for explicit EF Core deletion
        //    Xóa giỏ hàng sau thanh toán — dùng RemoveItems để EF Core xóa tường minh
        _unitOfWork.Carts.RemoveItems(cart.Items.ToList());

        // 6. Save everything atomically — all or nothing
        //    Lưu tất cả theo kiểu nguyên tử — tất cả hoặc không có gì
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return order.Id;
    }

    private static string GenerateOrderNumber() =>
        $"SGS-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}";

    private static decimal CalculateShippingFee(decimal subTotal) =>
        subTotal >= 500_000 ? 0 : 30_000;  // Free shipping over 500,000 VND
}
