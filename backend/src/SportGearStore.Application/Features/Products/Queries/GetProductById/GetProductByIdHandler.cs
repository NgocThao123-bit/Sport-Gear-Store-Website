// ============================================================
// FILE: Features/Products/Queries/GetProductById/GetProductByIdHandler.cs
// MỤC ĐÍCH: Xử lý truy vấn lấy chi tiết sản phẩm theo Id.
// ============================================================

using AutoMapper;
using MediatR;
using SportGearStore.Application.Common.Exceptions;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Application.Features.Products.DTOs;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Application.Features.Products.Queries.GetProductById;

public class GetProductByIdHandler : IRequestHandler<GetProductByIdQuery, ProductDetailDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetProductByIdHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ProductDetailDto> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        // GetDetailAsync loads the product with images, variants, and reviews
        // GetDetailAsync load sản phẩm kèm ảnh, biến thể và đánh giá
        var product = await _unitOfWork.Products.GetDetailAsync(request.Id, cancellationToken);

        if (product == null)
            throw new NotFoundException(nameof(Product), request.Id);

        return _mapper.Map<ProductDetailDto>(product);
    }
}
