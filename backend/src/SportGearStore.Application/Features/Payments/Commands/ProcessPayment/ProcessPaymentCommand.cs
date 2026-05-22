using MediatR;

namespace SportGearStore.Application.Features.Payments.Commands.ProcessPayment;

// Customer triggers this after order creation to simulate payment processing
// Customer gọi cái này sau khi tạo đơn hàng để giả lập xử lý thanh toán
public record ProcessPaymentCommand(
    Guid   OrderId,
    Guid   UserId,
    string PaymentMethod
) : IRequest<ProcessPaymentResult>;

public record ProcessPaymentResult(bool Success, string TransactionId, string Message);
