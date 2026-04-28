// ============================================================
// FILE: Common/Interfaces/Repositories/IUserRepository.cs
// MỤC ĐÍCH: Các truy vấn người dùng.
// ============================================================

using SportGearStore.Domain.Entities;

namespace SportGearStore.Application.Common.Interfaces.Repositories;

public interface IUserRepository : IGenericRepository<User>
{
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default);

    // Load user with their roles
    // Load user kèm theo roles của họ
    Task<User?> GetWithRolesAsync(Guid id, CancellationToken cancellationToken = default);
}
