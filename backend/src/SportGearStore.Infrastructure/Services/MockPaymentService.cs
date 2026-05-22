using SportGearStore.Application.Common.Interfaces.Services;

namespace SportGearStore.Infrastructure.Services;

// Simulates a real payment gateway for demo / CV purposes.
// Swap this with VNPayService or StripeService later without changing any other code.
// Giả lập payment gateway thật cho mục đích demo / CV.
// Sau này chỉ cần hoán đổi cái này với VNPayService hoặc StripeService mà không cần sửa code khác.
public class MockPaymentService : IPaymentService
{
    public async Task<PaymentResult> ProcessAsync(Guid orderId, string paymentMethod, decimal amount)
    {
        // Simulate network round-trip to a real payment gateway (~1.5 seconds)
        // Giả lập thời gian kết nối đến payment gateway thật (~1.5 giây)
        await Task.Delay(1500);

        var transactionId = $"MOCK-{Guid.NewGuid().ToString()[..8].ToUpper()}";
        return new PaymentResult(true, transactionId);
    }
}
