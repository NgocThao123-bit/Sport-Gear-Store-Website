// ============================================================
// FILE: Common/Models/PagedResult.cs
// PURPOSE: Generic wrapper for paginated API responses.
//          Every list endpoint (products, orders...) returns this.
// MỤC ĐÍCH: Wrapper chung cho các API response có phân trang.
//           Mọi endpoint trả về danh sách đều dùng kiểu này.
//
// EXAMPLE RESPONSE / VÍ DỤ RESPONSE:
// {
//   "items": [...],
//   "totalCount": 100,
//   "pageNumber": 1,
//   "pageSize": 10,
//   "totalPages": 10
// }
// ============================================================

namespace SportGearStore.Application.Common.Models;

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();

    // Total number of records matching the filter (before pagination)
    // Tổng số bản ghi khớp với bộ lọc (trước khi phân trang)
    public int TotalCount { get; set; }

    public int PageNumber { get; set; }
    public int PageSize { get; set; }

    // Calculated from TotalCount and PageSize
    // Tính từ TotalCount và PageSize
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);

    public bool HasPreviousPage => PageNumber > 1;
    public bool HasNextPage => PageNumber < TotalPages;
}
