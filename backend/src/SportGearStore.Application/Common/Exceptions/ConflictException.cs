// ============================================================
// FILE: Common/Exceptions/ConflictException.cs
// PURPOSE: Thrown when a create/update would violate a uniqueness rule.
//          E.g. registering with an email that already exists → HTTP 409.
// MỤC ĐÍCH: Ném ra khi tạo/cập nhật vi phạm quy tắc duy nhất.
//           VD: đăng ký với email đã tồn tại → HTTP 409.
// ============================================================

namespace SportGearStore.Application.Common.Exceptions;

public class ConflictException : Exception
{
    public ConflictException(string message)
        : base(message)
    {
    }
}
