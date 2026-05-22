// ============================================================
// FILE: Controllers/PaymentsController.cs
// PURPOSE: Payment processing endpoint.
// MỤC ĐÍCH: Endpoint xử lý thanh toán.
//
// ENDPOINTS:
//   POST /api/payments/process   → Customer — process payment for an order
// ============================================================

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportGearStore.Application.Common.Interfaces.Services;
using SportGearStore.Application.Features.Payments.Commands.ProcessPayment;

namespace SportGearStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly ISender             _sender;
    private readonly ICurrentUserService _currentUser;

    public PaymentsController(ISender sender, ICurrentUserService currentUser)
    {
        _sender      = sender;
        _currentUser = currentUser;
    }

    // POST /api/payments/process — process payment for a placed order
    // POST /api/payments/process — xử lý thanh toán cho đơn hàng đã đặt
    [HttpPost("process")]
    public async Task<IActionResult> ProcessPayment(
        [FromBody] ProcessPaymentRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new ProcessPaymentCommand(
                request.OrderId,
                _currentUser.UserId!.Value,
                request.PaymentMethod),
            cancellationToken);

        return Ok(result);
    }
}

public record ProcessPaymentRequest
{
    public Guid   OrderId       { get; init; }
    public string PaymentMethod { get; init; } = string.Empty;
}
