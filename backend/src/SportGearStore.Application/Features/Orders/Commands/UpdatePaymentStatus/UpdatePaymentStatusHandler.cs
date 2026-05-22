using MediatR;
using SportGearStore.Application.Common.Exceptions;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Application.Features.Orders.Commands.UpdatePaymentStatus;

public class UpdatePaymentStatusHandler : IRequestHandler<UpdatePaymentStatusCommand>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdatePaymentStatusHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(UpdatePaymentStatusCommand request, CancellationToken cancellationToken)
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(request.OrderId, cancellationToken);
        if (order == null)
            throw new NotFoundException(nameof(Order), request.OrderId);

        order.PaymentStatus = request.NewStatus;
        order.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Orders.Update(order);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
