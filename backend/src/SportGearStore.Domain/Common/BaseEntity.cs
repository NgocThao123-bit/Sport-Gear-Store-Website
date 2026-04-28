// ============================================================
// FILE: Common/BaseEntity.cs
// PURPOSE: Base class that every entity inherits from.
//          Provides shared fields: Id, CreatedAt, UpdatedAt.
// MỤC ĐÍCH: Class cha mà mọi entity đều kế thừa.
//           Cung cấp các trường dùng chung: Id, CreatedAt, UpdatedAt.
// ORDER: Create this FIRST inside Domain — all entities depend on it.
//        Tạo file này ĐẦU TIÊN trong Domain — mọi entity đều phụ thuộc vào nó.
// ============================================================

namespace SportGearStore.Domain.Common;

public abstract class BaseEntity
{
    // Unique identifier for every record in the database
    // Mã định danh duy nhất cho mỗi bản ghi trong database
    public Guid Id { get; set; } = Guid.NewGuid();

    // Timestamp when the record was created
    // Thời điểm bản ghi được tạo
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Timestamp when the record was last updated (null if never updated)
    // Thời điểm bản ghi được cập nhật lần cuối (null nếu chưa cập nhật)
    public DateTime? UpdatedAt { get; set; }
}
