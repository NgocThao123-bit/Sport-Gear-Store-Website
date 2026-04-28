using MediatR;

namespace SportGearStore.Application.Features.Cart.Commands.RemoveFromCart;

public record RemoveFromCartCommand(Guid UserId, Guid CartItemId) : IRequest;
