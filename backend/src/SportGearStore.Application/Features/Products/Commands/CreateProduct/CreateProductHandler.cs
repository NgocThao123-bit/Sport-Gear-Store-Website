// ============================================================
// FILE: Features/Products/Commands/CreateProduct/CreateProductHandler.cs
// MỤC ĐÍCH: Xử lý logic nghiệp vụ tạo sản phẩm mới.
// ============================================================

using MediatR;
using SportGearStore.Application.Common.Exceptions;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Application.Features.Products.Commands.CreateProduct;

public class CreateProductHandler : IRequestHandler<CreateProductCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateProductHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        // 1. Verify category exists
        //    Kiểm tra danh mục có tồn tại
        var category = await _unitOfWork.Categories.GetByIdAsync(request.CategoryId, cancellationToken);
        if (category == null)
            throw new NotFoundException(nameof(Category), request.CategoryId);

        // 2. Generate URL slug from product name
        //    Tạo slug URL từ tên sản phẩm
        var slug = GenerateSlug(request.Name);

        // 3. Check slug uniqueness
        //    Kiểm tra slug không bị trùng
        var slugExists = await _unitOfWork.Products.SlugExistsAsync(slug, cancellationToken: cancellationToken);
        if (slugExists)
            slug = $"{slug}-{Guid.NewGuid().ToString()[..6]}"; // Append short unique suffix

        // 4. Build the product entity
        //    Tạo entity sản phẩm
        var product = new Product
        {
            Name = request.Name,
            Slug = slug,
            Brand = request.Brand,
            Description = request.Description,
            Price = request.Price,
            SalePrice = request.SalePrice,
            CategoryId = request.CategoryId,
            IsActive = true
        };

        // 5. Add images
        //    Thêm hình ảnh
        for (int i = 0; i < request.ImageUrls.Count; i++)
        {
            product.Images.Add(new ProductImage
            {
                ImageUrl = request.ImageUrls[i],
                IsMain = request.ImageUrls[i] == request.MainImageUrl,
                DisplayOrder = i
            });
        }

        // 6. Add variants
        //    Thêm biến thể
        foreach (var v in request.Variants)
        {
            product.Variants.Add(new ProductVariant
            {
                Size = v.Size,
                Color = v.Color,
                Stock = v.Stock,
                ExtraPrice = v.ExtraPrice
            });
        }

        await _unitOfWork.Products.AddAsync(product, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return product.Id;
    }

    // Convert "Nike Air Max Running" → "nike-air-max-running"
    private static string GenerateSlug(string name) =>
        name.ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("'", "")
            .Replace("\"", "");
}
