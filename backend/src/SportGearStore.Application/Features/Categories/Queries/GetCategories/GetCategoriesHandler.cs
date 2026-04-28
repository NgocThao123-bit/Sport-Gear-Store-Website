using AutoMapper;
using MediatR;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Application.Features.Categories.DTOs;

namespace SportGearStore.Application.Features.Categories.Queries.GetCategories;

public class GetCategoriesHandler : IRequestHandler<GetCategoriesQuery, List<CategoryDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetCategoriesHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<List<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await _unitOfWork.Categories.GetActiveAsync(cancellationToken);
        return _mapper.Map<List<CategoryDto>>(categories);
    }
}
