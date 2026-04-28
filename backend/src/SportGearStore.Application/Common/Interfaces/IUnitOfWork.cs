// ============================================================
// FILE: Common/Interfaces/IUnitOfWork.cs
// PURPOSE: Groups all repositories under one transaction.
//          Call SaveChangesAsync() once after all DB operations
//          in a handler — either ALL changes save or NONE do.
// MỤC ĐÍCH: Nhóm tất cả repositories dưới một transaction.
//           Gọi SaveChangesAsync() một lần sau tất cả thao tác DB
//           trong một handler — TOÀN BỘ thay đổi được lưu hoặc KHÔNG CÓ gì.
//
// WHY? / TẠI SAO?
//   Example: creating an Order also reduces ProductVariant stock.
//   Both must succeed or both must fail. UnitOfWork ensures this.
//   VD: tạo Order cũng giảm tồn kho ProductVariant.
//   Cả hai phải thành công hoặc cả hai phải thất bại. UnitOfWork đảm bảo điều này.
// ============================================================

using SportGearStore.Application.Common.Interfaces.Repositories;

namespace SportGearStore.Application.Common.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IProductRepository Products { get; }
    ICategoryRepository Categories { get; }
    IUserRepository Users { get; }
    IOrderRepository Orders { get; }
    ICartRepository Carts { get; }

    // Persist all changes made in this unit of work to the database
    // Lưu tất cả thay đổi đã thực hiện trong unit of work này vào database
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
