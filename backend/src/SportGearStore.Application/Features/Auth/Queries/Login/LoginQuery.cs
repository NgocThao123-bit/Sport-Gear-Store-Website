// ============================================================
// FILE: Features/Auth/Queries/Login/LoginQuery.cs
// PURPOSE: Represents the "login" use case input.
//          It's a Query (not Command) because it reads/verifies data,
//          it does not mutate any state.
// MỤC ĐÍCH: Đại diện cho input của use case "đăng nhập".
//           Đây là Query (không phải Command) vì nó đọc/xác minh dữ liệu,
//           không thay đổi bất kỳ trạng thái nào.
// ============================================================

using MediatR;
using SportGearStore.Application.Features.Auth.DTOs;

namespace SportGearStore.Application.Features.Auth.Queries.Login;

public record LoginQuery(
    string Email,
    string Password
) : IRequest<AuthResponseDto>;
