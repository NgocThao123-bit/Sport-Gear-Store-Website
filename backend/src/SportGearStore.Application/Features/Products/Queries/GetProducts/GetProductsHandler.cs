// ============================================================
// FILE: Features/Products/Queries/GetProducts/GetProductsHandler.cs
// MỤC ĐÍCH: Xử lý truy vấn lấy danh sách sản phẩm có phân trang.
// ============================================================

using AutoMapper;
using MediatR;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Application.Common.Models;
using SportGearStore.Application.Features.Products.DTOs;

namespace SportGearStore.Application.Features.Products.Queries.GetProducts;

public class GetProductsHandler : IRequestHandler<GetProductsQuery, PagedResult<ProductDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetProductsHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PagedResult<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var pagedProducts = await _unitOfWork.Products.GetPagedAsync(
            request.PageNumber,
            request.PageSize,
            request.CategoryId,
            request.SearchTerm,
            request.MinPrice,
            request.MaxPrice,
            request.SortBy,
            cancellationToken);

        // Map domain entities to DTOs using AutoMapper
        // Map domain entities sang DTOs bằng AutoMapper
        return new PagedResult<ProductDto>
        {
            Items = _mapper.Map<List<ProductDto>>(pagedProducts.Items),
            TotalCount = pagedProducts.TotalCount,
            PageNumber = pagedProducts.PageNumber,
            PageSize = pagedProducts.PageSize
        };
    }
}
