using MediatR;
using SportGearStore.Application.Common.Exceptions;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Application.Common.Interfaces.Services;
using SportGearStore.Domain.Entities;
using SportGearStore.Domain.Enums;

namespace SportGearStore.Application.Features.Payments.Commands.ProcessPayment;

public class ProcessPaymentHandler : IRequestHandler<ProcessPaymentCommand, ProcessPaymentResult>
{
    private readonly IUnitOfWork     _unitOfWork;
    private readonly IPaymentService _paymentService;

    public ProcessPaymentHandler(IUnitOfWork unitOfWork, IPaymentService paymentService)
    {
        _unitOfWork     = unitOfWork;
        _paymentService = paymentService;
    }

    public async Task<ProcessPaymentResult> Handle(ProcessPaymentCommand request, CancellationToken cancellationToken)
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(request.OrderId, cancellationToken);
        if (order == null)
            throw new NotFoundException(nameof(Order), request.OrderId);

        // Verify the order belongs to the requesting user
        // Xác minh đơn hàng thuộc về người dùng đang yêu cầu
        if (order.UserId != request.UserId)
            throw new ForbiddenException();

        // COD: no payment processing — money collected on delivery
        // COD: không xử lý thanh toán — thu tiền khi giao hàng
        if (request.PaymentMethod == "Cash on Delivery")
            return new ProcessPaymentResult(true, "COD", "Order placed. Pay on delivery.");

        // Card / e-wallet: delegate to payment service (mock or real gateway)
        // Thẻ / ví điện tử: giao cho payment service (mock hoặc gateway thật)
        var result = await _paymentService.ProcessAsync(order.Id, request.PaymentMethod, order.TotalAmount);

        if (result.Success)
        {
            order.PaymentStatus = PaymentStatus.Paid;
            order.UpdatedAt     = DateTime.UtcNow;
            _unitOfWork.Orders.Update(order);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        return new ProcessPaymentResult(
            result.Success,
            result.TransactionId,
            result.Success ? "Payment successful." : "Payment failed. Please try again."
        );
    }
}
