// ============================================================
// FILE: Controllers/OrdersController.cs
// PURPOSE: Order endpoints for customers and admin.
// MỤC ĐÍCH: Endpoints đơn hàng cho khách hàng và admin.
//
// ENDPOINTS:
//   POST /api/orders                     → Customer — checkout (create order from cart)
//   GET  /api/orders                     → Customer — own order history
//   GET  /api/orders/{id}                → Customer/Admin — order detail
//   PUT  /api/orders/{id}/status         → Admin only — update order status
//   GET  /api/orders/admin/all           → Admin only — all orders paginated
// ============================================================

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportGearStore.Application.Common.Interfaces.Services;
using SportGearStore.Application.Features.Orders.Commands.CreateOrder;
using SportGearStore.Application.Features.Orders.Commands.UpdateOrderStatus;
using SportGearStore.Application.Features.Orders.Queries.GetAllOrders;
using SportGearStore.Application.Features.Orders.Queries.GetOrderById;
using SportGearStore.Application.Features.Orders.Queries.GetOrders;
using SportGearStore.Domain.Enums;

namespace SportGearStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly ISender _sender;
    private readonly ICurrentUserService _currentUser;

    public OrdersController(ISender sender, ICurrentUserService currentUser)
    {
        _sender = sender;
        _currentUser = currentUser;
    }

    // POST /api/orders — checkout: converts cart to order
    // POST /api/orders — thanh toán: chuyển giỏ hàng thành đơn hàng
    [HttpPost]
    public async Task<IActionResult> CreateOrder(
        [FromBody] CreateOrderRequest request,
        CancellationToken cancellationToken)
    {
        var orderId = await _sender.Send(
            new CreateOrderCommand(
                _currentUser.UserId!.Value,
                request.ShippingAddress,
                request.PaymentMethod,
                request.Notes),
            cancellationToken);

        return CreatedAtAction(nameof(GetOrderById), new { id = orderId }, new { id = orderId });
    }

    // GET /api/orders — customer's own orders
    [HttpGet]
    public async Task<IActionResult> GetOrders(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(
            new GetOrdersQuery(_currentUser.UserId!.Value, pageNumber, pageSize),
            cancellationToken);
        return Ok(result);
    }

    // GET /api/orders/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetOrderById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new GetOrderByIdQuery(id, _currentUser.UserId!.Value, _currentUser.IsAdmin),
            cancellationToken);
        return Ok(result);
    }

    // GET /api/orders/admin/all — Admin only, all orders paginated
    // NOTE: this route must be declared BEFORE {id:guid} so the router matches "admin/all" literally
    [HttpGet("admin/all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllOrders(
        [FromQuery] int          pageNumber = 1,
        [FromQuery] int          pageSize   = 10,
        [FromQuery] OrderStatus? status     = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(
            new GetAllOrdersQuery(pageNumber, pageSize, status),
            cancellationToken);
        return Ok(result);
    }

    // PUT /api/orders/{id}/status — Admin only
    [HttpPut("{id:guid}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateOrderStatus(
        Guid id,
        [FromBody] UpdateOrderStatusRequest request,
        CancellationToken cancellationToken)
    {
        await _sender.Send(
            new UpdateOrderStatusCommand(id, request.NewStatus),
            cancellationToken);
        return NoContent();
    }
}

public record CreateOrderRequest(
    string ShippingAddress,
    string PaymentMethod,
    string? Notes
);

public record UpdateOrderStatusRequest(OrderStatus NewStatus);
