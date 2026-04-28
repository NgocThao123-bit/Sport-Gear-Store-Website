// ============================================================
// FILE: Common/Interfaces/Repositories/IGenericRepository.cs
// PURPOSE: Base repository interface with common CRUD operations.
//          All specific repositories extend this.
// MỤC ĐÍCH: Interface repository cơ bản với các thao tác CRUD chung.
//           Tất cả repository cụ thể đều kế thừa interface này.
//
// WHY AN INTERFACE? / TẠI SAO DÙNG INTERFACE?
//   Application defines the contract. Infrastructure implements it.
//   This way, Application never depends on EF Core directly.
//   Application định nghĩa hợp đồng. Infrastructure thực thi nó.
//   Nhờ vậy, Application không bao giờ phụ thuộc trực tiếp vào EF Core.
// ============================================================

using SportGearStore.Domain.Common;

namespace SportGearStore.Application.Common.Interfaces.Repositories;

public interface IGenericRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(T entity, CancellationToken cancellationToken = default);
    void Update(T entity);
    void Delete(T entity);
}
