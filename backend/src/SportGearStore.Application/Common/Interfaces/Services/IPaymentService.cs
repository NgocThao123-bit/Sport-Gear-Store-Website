namespace SportGearStore.Application.Common.Interfaces.Services;

// Abstraction over any payment gateway (mock, VNPay, Stripe, etc.)
// Abstraction cho mọi payment gateway (mock, VNPay, Stripe, v.v.)
public interface IPaymentService
{
    Task<PaymentResult> ProcessAsync(Guid orderId, string paymentMethod, decimal amount);
}

public record PaymentResult(bool Success, string TransactionId);
