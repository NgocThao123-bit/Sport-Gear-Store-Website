// ============================================================
// FILE: Features/Orders/UpdatePaymentStatusHandlerTests.cs
// PURPOSE: Unit tests for UpdatePaymentStatusHandler (admin action).
// MỤC ĐÍCH: Unit test cho UpdatePaymentStatusHandler (hành động của admin).
//
// TEST CASES:
//   1. Order not found → NotFoundException
//   2. Valid order     → PaymentStatus updated and saved
//   3. UpdatedAt       → refreshed when status changes
// ============================================================

using FluentAssertions;
using NSubstitute;
using SportGearStore.Application.Common.Exceptions;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Application.Common.Interfaces.Repositories;
using SportGearStore.Application.Features.Orders.Commands.UpdatePaymentStatus;
using SportGearStore.Domain.Entities;
using SportGearStore.Domain.Enums;

namespace SportGearStore.Application.Tests.Features.Orders;

public class UpdatePaymentStatusHandlerTests
{
    // ── Shared test doubles ─────────────────────────────────────────────────
    private readonly IUnitOfWork      _uow;
    private readonly IOrderRepository _orderRepo;
    private readonly UpdatePaymentStatusHandler _handler;

    public UpdatePaymentStatusHandlerTests()
    {
        _uow       = Substitute.For<IUnitOfWork>();
        _orderRepo = Substitute.For<IOrderRepository>();
        _uow.Orders.Returns(_orderRepo);
        _handler   = new UpdatePaymentStatusHandler(_uow);
    }

    // ── Test 1: Order not found → NotFoundException ─────────────────────────
    [Fact]
    public async Task Handle_OrderNotFound_ThrowsNotFoundException()
    {
        // Arrange
        var orderId = Guid.NewGuid();
        _orderRepo.GetByIdAsync(orderId, Arg.Any<CancellationToken>())
                  .Returns((Order?)null);

        var command = new UpdatePaymentStatusCommand(orderId, PaymentStatus.Paid);

        // Act
        var act = () => _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>();
    }

    // ── Test 2: Valid order → PaymentStatus is updated ──────────────────────
    [Fact]
    public async Task Handle_ValidOrder_UpdatesPaymentStatus()
    {
        // Arrange
        var order = new Order
        {
            Id            = Guid.NewGuid(),
            PaymentStatus = PaymentStatus.Unpaid,
        };

        _orderRepo.GetByIdAsync(order.Id, Arg.Any<CancellationToken>())
                  .Returns(order);

        var command = new UpdatePaymentStatusCommand(order.Id, PaymentStatus.Paid);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        order.PaymentStatus.Should().Be(PaymentStatus.Paid);
        await _uow.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    // ── Test 3: UpdatedAt is refreshed ─────────────────────────────────────
    [Fact]
    public async Task Handle_ValidOrder_RefreshesUpdatedAt()
    {
        // Arrange
        var oldTime = DateTime.UtcNow.AddDays(-1);
        var order   = new Order
        {
            Id            = Guid.NewGuid(),
            UpdatedAt     = oldTime,
            PaymentStatus = PaymentStatus.Unpaid,
        };

        _orderRepo.GetByIdAsync(order.Id, Arg.Any<CancellationToken>())
                  .Returns(order);

        var beforeAct = DateTime.UtcNow;
        var command   = new UpdatePaymentStatusCommand(order.Id, PaymentStatus.Refunded);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        order.UpdatedAt.Should().BeOnOrAfter(beforeAct);
    }

    // ── Test 4: Can change to any valid status ───────────────────────────────
    [Theory]
    [InlineData(PaymentStatus.Unpaid)]
    [InlineData(PaymentStatus.Paid)]
    [InlineData(PaymentStatus.Refunded)]
    public async Task Handle_AnyStatus_SetCorrectly(PaymentStatus targetStatus)
    {
        // Arrange
        var order = new Order { Id = Guid.NewGuid(), PaymentStatus = PaymentStatus.Unpaid };
        _orderRepo.GetByIdAsync(order.Id, Arg.Any<CancellationToken>()).Returns(order);

        var command = new UpdatePaymentStatusCommand(order.Id, targetStatus);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        order.PaymentStatus.Should().Be(targetStatus);
    }
}
