// ============================================================
// FILE: Features/Orders/CreateOrderHandlerTests.cs
// PURPOSE: Unit tests for CreateOrderHandler — the core checkout logic.
// MỤC ĐÍCH: Unit test cho CreateOrderHandler — logic thanh toán cốt lõi.
//
// TEST CASES:
//   1. Empty cart    → ConflictException
//   2. Null cart     → ConflictException
//   3. SubTotal < $50 → $5 shipping fee
//   4. SubTotal ≥ $50 → $0 shipping fee (free)
//   5. Stock reduced  → variant.Stock decremented by quantity ordered
//   6. Cart cleared   → RemoveItems called after order created
// ============================================================

using FluentAssertions;
using NSubstitute;
using SportGearStore.Application.Common.Exceptions;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Application.Common.Interfaces.Repositories;
using SportGearStore.Application.Features.Orders.Commands.CreateOrder;
using SportGearStore.Domain.Entities;
using SportGearStore.Domain.Enums;

namespace SportGearStore.Application.Tests.Features.Orders;

public class CreateOrderHandlerTests
{
    // ── Shared test doubles ─────────────────────────────────────────────────
    private readonly IUnitOfWork      _uow;
    private readonly ICartRepository  _cartRepo;
    private readonly IOrderRepository _orderRepo;
    private readonly CreateOrderHandler _handler;

    public CreateOrderHandlerTests()
    {
        _uow       = Substitute.For<IUnitOfWork>();
        _cartRepo  = Substitute.For<ICartRepository>();
        _orderRepo = Substitute.For<IOrderRepository>();

        _uow.Carts.Returns(_cartRepo);
        _uow.Orders.Returns(_orderRepo);

        _handler = new CreateOrderHandler(_uow);
    }

    // ── Helper: build a cart with 1 item of given unit price and quantity ───
    private static Cart BuildCart(Guid userId, decimal unitPrice, int quantity, bool withVariant = true)
    {
        var product = new Product
        {
            Id     = Guid.NewGuid(),
            Name   = "Test Product",
            Price  = unitPrice,
            Images = new List<ProductImage>(),
        };

        var variant = withVariant ? new ProductVariant
        {
            Id    = Guid.NewGuid(),
            Size  = "M",
            Color = "Black",
            Stock = 20,
        } : null;

        var item = new CartItem
        {
            Id               = Guid.NewGuid(),
            ProductId        = product.Id,
            Product          = product,
            ProductVariantId = variant?.Id,
            ProductVariant   = variant,
            Quantity         = quantity,
            UnitPrice        = unitPrice,
        };

        return new Cart
        {
            Id     = Guid.NewGuid(),
            UserId = userId,
            Items  = new List<CartItem> { item },
        };
    }

    private static CreateOrderCommand BuildCommand(Guid userId) =>
        new CreateOrderCommand(userId, "123 Main St", "Credit Card", null);

    // ── Test 1: Null cart → ConflictException ───────────────────────────────
    [Fact]
    public async Task Handle_NullCart_ThrowsConflictException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        _cartRepo.GetByUserIdAsync(userId, Arg.Any<CancellationToken>())
                 .Returns((Cart?)null);

        // Act
        var act = () => _handler.Handle(BuildCommand(userId), CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<ConflictException>()
            .WithMessage("*empty cart*");
    }

    // ── Test 2: Empty cart (no items) → ConflictException ──────────────────
    [Fact]
    public async Task Handle_EmptyCart_ThrowsConflictException()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var emptyCart = new Cart { Id = Guid.NewGuid(), UserId = userId, Items = new List<CartItem>() };
        _cartRepo.GetByUserIdAsync(userId, Arg.Any<CancellationToken>())
                 .Returns(emptyCart);

        // Act
        var act = () => _handler.Handle(BuildCommand(userId), CancellationToken.None);

        // Assert
        await act.Should().ThrowAsync<ConflictException>();
    }

    // ── Test 3: SubTotal < $50 → shipping fee = $5 ─────────────────────────
    [Fact]
    public async Task Handle_SubTotalBelow50_AppliesShippingFee()
    {
        // Arrange — 1 item × $30 = subTotal $30 → shipping $5
        var userId = Guid.NewGuid();
        _cartRepo.GetByUserIdAsync(userId, Arg.Any<CancellationToken>())
                 .Returns(BuildCart(userId, unitPrice: 30, quantity: 1));

        Order? savedOrder = null;
        await _orderRepo.AddAsync(Arg.Do<Order>(o => savedOrder = o), Arg.Any<CancellationToken>());

        // Act
        await _handler.Handle(BuildCommand(userId), CancellationToken.None);

        // Assert
        savedOrder.Should().NotBeNull();
        savedOrder!.ShippingFee.Should().Be(5);
        savedOrder.TotalAmount.Should().Be(35);   // 30 + 5
    }

    // ── Test 4: SubTotal ≥ $50 → free shipping ─────────────────────────────
    [Fact]
    public async Task Handle_SubTotalAtLeast50_FreeShipping()
    {
        // Arrange — 1 item × $60 = subTotal $60 → shipping $0
        var userId = Guid.NewGuid();
        _cartRepo.GetByUserIdAsync(userId, Arg.Any<CancellationToken>())
                 .Returns(BuildCart(userId, unitPrice: 60, quantity: 1));

        Order? savedOrder = null;
        await _orderRepo.AddAsync(Arg.Do<Order>(o => savedOrder = o), Arg.Any<CancellationToken>());

        // Act
        await _handler.Handle(BuildCommand(userId), CancellationToken.None);

        // Assert
        savedOrder!.ShippingFee.Should().Be(0);
        savedOrder.TotalAmount.Should().Be(60);   // 60 + 0
    }

    // ── Test 5: Stock is reduced by the quantity ordered ───────────────────
    [Fact]
    public async Task Handle_ValidCart_ReducesVariantStock()
    {
        // Arrange — variant starts at Stock=20, ordering 3 → expect Stock=17
        var userId = Guid.NewGuid();
        var cart   = BuildCart(userId, unitPrice: 20, quantity: 3, withVariant: true);
        var variant = cart.Items.First().ProductVariant!;
        variant.Stock = 20;

        _cartRepo.GetByUserIdAsync(userId, Arg.Any<CancellationToken>())
                 .Returns(cart);

        // Act
        await _handler.Handle(BuildCommand(userId), CancellationToken.None);

        // Assert
        variant.Stock.Should().Be(17);
    }

    // ── Test 6: Cart items are cleared after order creation ─────────────────
    [Fact]
    public async Task Handle_ValidCart_ClearsCartItems()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var cart   = BuildCart(userId, unitPrice: 20, quantity: 1);
        _cartRepo.GetByUserIdAsync(userId, Arg.Any<CancellationToken>())
                 .Returns(cart);

        // Act
        await _handler.Handle(BuildCommand(userId), CancellationToken.None);

        // Assert — RemoveItems must be called with all cart items
        _cartRepo.Received(1).RemoveItems(Arg.Is<IEnumerable<CartItem>>(
            items => items.SequenceEqual(cart.Items)));
    }

    // ── Test 7: Order number format ─────────────────────────────────────────
    [Fact]
    public async Task Handle_ValidCart_OrderNumberStartsWithSGS()
    {
        // Arrange
        var userId = Guid.NewGuid();
        _cartRepo.GetByUserIdAsync(userId, Arg.Any<CancellationToken>())
                 .Returns(BuildCart(userId, unitPrice: 20, quantity: 1));

        Order? savedOrder = null;
        await _orderRepo.AddAsync(Arg.Do<Order>(o => savedOrder = o), Arg.Any<CancellationToken>());

        // Act
        await _handler.Handle(BuildCommand(userId), CancellationToken.None);

        // Assert
        savedOrder!.OrderNumber.Should().StartWith("SGS-");
    }
}
