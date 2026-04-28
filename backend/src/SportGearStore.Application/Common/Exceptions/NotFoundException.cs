// ============================================================
// FILE: Common/Exceptions/NotFoundException.cs
// PURPOSE: Thrown when a requested resource does not exist in the database.
//          The global exception middleware catches this and returns HTTP 404.
// MỤC ĐÍCH: Ném ra khi tài nguyên được yêu cầu không tồn tại trong database.
//           Middleware xử lý lỗi toàn cục sẽ bắt lỗi này và trả về HTTP 404.
// ============================================================

namespace SportGearStore.Application.Common.Exceptions;

public class NotFoundException : Exception
{
    // e.g. throw new NotFoundException(nameof(Product), id)
    // → "Product with id '3fa85f64' was not found."
    public NotFoundException(string name, object key)
        : base($"{name} with id '{key}' was not found.")
    {
    }
}
