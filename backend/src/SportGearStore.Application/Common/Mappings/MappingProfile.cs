// ============================================================
// FILE: Common/Mappings/MappingProfile.cs
// PURPOSE: Tells AutoMapper how to convert Domain entities to DTOs.
//          Without this, AutoMapper doesn't know which field maps to which.
// MỤC ĐÍCH: Cho AutoMapper biết cách chuyển đổi Domain entities sang DTOs.
//           Nếu không có file này, AutoMapper không biết trường nào map với trường nào.
//
// HOW IT WORKS / CÁCH HOẠT ĐỘNG:
//   CreateMap<Source, Destination>()
//   AutoMapper copies fields with matching names automatically.
//   For mismatched names, use .ForMember() to specify manually.
//   AutoMapper tự động copy các trường có tên khớp nhau.
//   Với tên không khớp, dùng .ForMember() để chỉ định thủ công.
// ============================================================

using AutoMapper;
using SportGearStore.Application.Features.Cart.DTOs;
using SportGearStore.Application.Features.Categories.DTOs;
using SportGearStore.Application.Features.Orders.DTOs;
using SportGearStore.Application.Features.Products.DTOs;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Application.Common.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // ── Products ──────────────────────────────────────────
        CreateMap<Product, ProductDto>()
            .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Category.Name))
            .ForMember(d => d.MainImageUrl, o => o.MapFrom(s =>
                s.Images.FirstOrDefault(i => i.IsMain) != null
                    ? s.Images.First(i => i.IsMain).ImageUrl
                    : s.Images.FirstOrDefault() != null ? s.Images.First().ImageUrl : null))
            .ForMember(d => d.AverageRating, o => o.MapFrom(s =>
                s.Reviews.Any(r => r.IsApproved) ? s.Reviews.Where(r => r.IsApproved).Average(r => r.Rating) : 0.0))
            .ForMember(d => d.ReviewCount, o => o.MapFrom(s =>
                s.Reviews.Count(r => r.IsApproved)));

        CreateMap<Product, ProductDetailDto>()
            .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Category.Name))
            .ForMember(d => d.AverageRating, o => o.MapFrom(s =>
                s.Reviews.Any(r => r.IsApproved) ? s.Reviews.Where(r => r.IsApproved).Average(r => r.Rating) : 0.0))
            .ForMember(d => d.ReviewCount, o => o.MapFrom(s =>
                s.Reviews.Count(r => r.IsApproved)))
            .ForMember(d => d.Reviews, o => o.MapFrom(s =>
                s.Reviews.Where(r => r.IsApproved).ToList()));

        CreateMap<ProductImage, ProductImageDto>();
        CreateMap<ProductVariant, ProductVariantDto>();
        CreateMap<Review, ReviewDto>()
            .ForMember(d => d.UserFullName, o => o.MapFrom(s =>
                $"{s.User.FirstName} {s.User.LastName}"));

        // ── Categories ────────────────────────────────────────
        CreateMap<Category, CategoryDto>()
            .ForMember(d => d.ProductCount, o => o.MapFrom(s =>
                s.Products.Count(p => p.IsActive)));

        // ── Cart ──────────────────────────────────────────────
        CreateMap<Cart, CartDto>()
            .ForMember(d => d.TotalAmount, o => o.MapFrom(s =>
                s.Items.Sum(i => i.UnitPrice * i.Quantity)))
            .ForMember(d => d.TotalItems, o => o.MapFrom(s =>
                s.Items.Sum(i => i.Quantity)));

        CreateMap<CartItem, CartItemDto>()
            .ForMember(d => d.ProductName, o => o.MapFrom(s => s.Product.Name))
            .ForMember(d => d.ProductImageUrl, o => o.MapFrom(s =>
                s.Product.Images.FirstOrDefault(i => i.IsMain) != null
                    ? s.Product.Images.First(i => i.IsMain).ImageUrl
                    : null))
            .ForMember(d => d.VariantInfo, o => o.MapFrom(s =>
                s.ProductVariant != null
                    ? $"Size: {s.ProductVariant.Size} | Color: {s.ProductVariant.Color}"
                    : null))
            .ForMember(d => d.TotalPrice, o => o.MapFrom(s => s.UnitPrice * s.Quantity));

        // ── Orders ────────────────────────────────────────────
        CreateMap<Order, OrderDto>()
            .ForMember(d => d.ItemCount,        o => o.MapFrom(s => s.Items.Count))
            .ForMember(d => d.CustomerEmail,    o => o.MapFrom(s => s.User != null ? s.User.Email : string.Empty))
            .ForMember(d => d.FirstItemImageUrl, o => o.MapFrom(s => s.Items.FirstOrDefault() != null ? s.Items.First().ProductImageUrl : null))
            .ForMember(d => d.FirstItemName,    o => o.MapFrom(s => s.Items.FirstOrDefault() != null ? s.Items.First().ProductName : null));

        CreateMap<Order, OrderDetailDto>();
        CreateMap<OrderItem, OrderItemDto>();
    }
}
