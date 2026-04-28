// ============================================================
// FILE: Features/Categories/DTOs/CategoryDtos.cs
// MỤC ĐÍCH: Cấu trúc dữ liệu cho API response danh mục sản phẩm.
// ============================================================

namespace SportGearStore.Application.Features.Categories.DTOs;

public record CategoryDto(
    Guid Id,
    string Name,
    string Slug,
    string? Description,
    string? ImageUrl,
    int ProductCount
);
