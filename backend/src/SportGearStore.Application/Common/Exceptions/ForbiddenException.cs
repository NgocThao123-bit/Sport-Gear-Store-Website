// ============================================================
// FILE: Common/Exceptions/ForbiddenException.cs
// PURPOSE: Thrown when a user tries to access a resource they don't have
//          permission for. Middleware returns HTTP 403.
// MỤC ĐÍCH: Ném ra khi người dùng cố truy cập tài nguyên mà họ không
//           có quyền. Middleware trả về HTTP 403.
// ============================================================

namespace SportGearStore.Application.Common.Exceptions;

public class ForbiddenException : Exception
{
    public ForbiddenException()
        : base("You do not have permission to perform this action.")
    {
    }

    public ForbiddenException(string message)
        : base(message)
    {
    }
}
