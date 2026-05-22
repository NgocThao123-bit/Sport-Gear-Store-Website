using MediatR;
using SportGearStore.Domain.Enums;

namespace SportGearStore.Application.Features.Orders.Commands.UpdatePaymentStatus;

// Admin use case: mark an order as Paid or Refunded
// Use case của Admin: đánh dấu đơn hàng là Đã thanh toán hoặc Đã hoàn tiền
public record UpdatePaymentStatusCommand(Guid OrderId, PaymentStatus NewStatus) : IRequest;
