// ============================================================
// FILE: Features/Orders/Commands/CreateOrder/CreateOrderCommand.cs
// PURPOSE: Checkout — converts the cart into a confirmed order.
// MỤC ĐÍCH: Thanh toán — chuyển giỏ hàng thành đơn hàng đã xác nhận.
// ============================================================

using MediatR;

namespace SportGearStore.Application.Features.Orders.Commands.CreateOrder;

public record CreateOrderCommand(
    Guid UserId,
    string ShippingAddress,
    string PaymentMethod,    // "COD" or "BankTransfer"
    string? Notes
) : IRequest<Guid>;          // Returns the new order's Id
