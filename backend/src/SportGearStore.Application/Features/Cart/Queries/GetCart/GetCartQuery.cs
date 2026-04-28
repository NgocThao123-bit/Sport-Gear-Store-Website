// ============================================================
// FILE: Features/Cart/Queries/GetCart/GetCartQuery.cs
// PURPOSE: Fetch the current user's cart contents.
// MỤC ĐÍCH: Lấy nội dung giỏ hàng của người dùng hiện tại.
// ============================================================

using MediatR;
using SportGearStore.Application.Features.Cart.DTOs;

namespace SportGearStore.Application.Features.Cart.Queries.GetCart;

public record GetCartQuery(Guid UserId) : IRequest<CartDto>;
