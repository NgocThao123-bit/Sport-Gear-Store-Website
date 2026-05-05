using AutoMapper;
using MediatR;
using SportGearStore.Application.Common.Exceptions;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Application.Features.Products.DTOs;

namespace SportGearStore.Application.Features.Products.Queries.GetProductBySlug;

public class GetProductBySlugHandler : IRequestHandler<GetProductBySlugQuery, ProductDetailDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper     _mapper;

    public GetProductBySlugHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper     = mapper;
    }

    public async Task<ProductDetailDto> Handle(GetProductBySlugQuery request, CancellationToken cancellationToken)
    {
        var product = await _unitOfWork.Products.GetDetailBySlugAsync(request.Slug, cancellationToken);

        if (product == null)
            throw new NotFoundException("Product", request.Slug);

        return _mapper.Map<ProductDetailDto>(product);
    }
}
