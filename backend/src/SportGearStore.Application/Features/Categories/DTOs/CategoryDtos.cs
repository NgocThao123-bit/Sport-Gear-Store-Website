// ============================================================
// FILE: Features/Categories/DTOs/CategoryDtos.cs
// MỤC ĐÍCH: Cấu trúc dữ liệu cho API response danh mục sản phẩm.
// ============================================================

namespace SportGearStore.Application.Features.Categories.DTOs;

public record CategoryDto
{
    public Guid    Id           { get; init; }
    public string  Name         { get; init; } = string.Empty;
    public string  Slug         { get; init; } = string.Empty;
    public string? Description  { get; init; }
    public string? ImageUrl     { get; init; }
    public int     ProductCount { get; init; }
}
