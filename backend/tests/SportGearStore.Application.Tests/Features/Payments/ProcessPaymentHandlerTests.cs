// ============================================================
// FILE: Features/Payments/ProcessPaymentHandlerTests.cs
// PURPOSE: Unit tests for ProcessPaymentHandler.
// MỤC ĐÍCH: Unit test cho ProcessPaymentHandler.
//
// TEST CASES:
//   1. Order not found        → NotFoundException
//   2. Wrong user             → ForbiddenException
//   3. COD payment            → success immediately, NO payment service call
//   4. Card/wallet success    → calls payment service, sets PaymentStatus.Paid
//   5. Card/wallet failure    → returns failed result, status stays Unpaid
// ============================================================

using FluentAssertions;
using NSubstitute;
using SportGearStore.Application.Common.Exceptions;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Application.Common.Interfaces.Repositories;
using SportGearStore.Application.Common.Interfaces.Services;
using SportGearStore.Application.Features.Payments.Commands.ProcessPayment;
using SportGearStore.Domain.Entities;
using SportGearStore.Domain.Enums;

namespace SportGearStore.Application.Tests.Features.Payments;

public class ProcessPaymentHandlerTests
{
    // ── Shared test doubles ─────────────────────────────────────────────────
    private readonly IUnitOfWork      _uow;
    private readonly IOrderRepository _orderRepo;
    private readonly IPaymentService  _paymentService;
    private readonly ProcessPaymentHandler _handler;

    public ProcessPaymentHandlerTests()
    {
        _uow            = Substitute.For<IUnitOfWork>();
        _orderRepo      = Substitute.For<IOrderRepository>();
        _paymentService = Substitute.For<IPaymentService>();

        _uow.Orders.Returns(_orderRepo);

        _handler = new ProcessPaymentHandler(_uow, _paymentService);
    }

    // ── Helper: build a minimal order ──────────────────────────────────────
    private static Order BuildOrder(Guid userId, decimal total = 100m) =>
        new Order
        {
            Id            = Guid.NewGuid(),
            UserId        = userId,
            TotalAmount   = total,
            PaymentStatus = PaymentStatus.Unpaid,
        };

    // ── Test 1: Order not found → NotFoundException ─────────────────────────
    [Fact]
    public async Task Handle_OrderNotFound_ThrowsNotFoundException()
    {
        // Arrange
        var orderId = Guid.NewGuid();
        _orderRepo.GetByIdAsync(orderId, Arg.Any<CancellationToken>())
                  .Returns((Order?)null);

        var command = new ProcessPaymentCommand(orderId, Guid.NewGuid(), "Credit Card");

        // Act
        var act = () => _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<NotFoundException>();
    }

    // ── Test 2: Different user → ForbiddenException ─────────────────────────
    [Fact]
    public async Task Handle_WrongUser_ThrowsForbiddenException()
    {
        // Arrange
        var orderOwner   = Guid.NewGuid();
        var requestingUser = Guid.NewGuid();   // different user!
        var order = BuildOrder(orderOwner);

        _orderRepo.GetByIdAsync(order.Id, Arg.Any<CancellationToken>())
                  .Returns(order);

        var command = new ProcessPaymentCommand(order.Id, requestingUser, "Credit Card");

        // Act
        var act = () => _handler.Handle(command, CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<ForbiddenException>();
    }

    // ── Test 3: COD → success without calling payment service ──────────────
    [Fact]
    public async Task Handle_CodPayment_SucceedsWithoutCallingPaymentService()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var order  = BuildOrder(userId);

        _orderRepo.GetByIdAsync(order.Id, Arg.Any<CancellationToken>())
                  .Returns(order);

        var command = new ProcessPaymentCommand(order.Id, userId, "Cash on Delivery");

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Success.Should().BeTrue();
        result.TransactionId.Should().Be("COD");

        // Payment service must NOT be called for COD
        await _paymentService.DidNotReceive()
            .ProcessAsync(Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<decimal>());
    }

    // ── Test 4: Card payment success → PaymentStatus set to Paid ───────────
    [Fact]
    public async Task Handle_CardPaymentSuccess_SetsStatusToPaid()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var order  = BuildOrder(userId, total: 120m);

        _orderRepo.GetByIdAsync(order.Id, Arg.Any<CancellationToken>())
                  .Returns(order);

        _paymentService.ProcessAsync(order.Id, "Credit Card", 120m)
                       .Returns(new PaymentResult(true, "MOCK-ABC123"));

        var command = new ProcessPaymentCommand(order.Id, userId, "Credit Card");

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Success.Should().BeTrue();
        result.TransactionId.Should().Be("MOCK-ABC123");
        order.PaymentStatus.Should().Be(PaymentStatus.Paid);
        await _uow.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    // ── Test 5: Card payment failure → returns failure, status stays Unpaid ─
    [Fact]
    public async Task Handle_CardPaymentFailure_ReturnsFailureWithoutChangingStatus()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var order  = BuildOrder(userId);

        _orderRepo.GetByIdAsync(order.Id, Arg.Any<CancellationToken>())
                  .Returns(order);

        _paymentService.ProcessAsync(order.Id, Arg.Any<string>(), Arg.Any<decimal>())
                       .Returns(new PaymentResult(false, string.Empty));

        var command = new ProcessPaymentCommand(order.Id, userId, "MoMo");

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Success.Should().BeFalse();
        order.PaymentStatus.Should().Be(PaymentStatus.Unpaid);  // unchanged
    }
}
