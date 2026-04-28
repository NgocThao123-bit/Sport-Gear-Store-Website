using MediatR;
using SportGearStore.Application.Common.Exceptions;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Application.Features.Categories.Commands.CreateCategory;

public class CreateCategoryHandler : IRequestHandler<CreateCategoryCommand, Guid>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateCategoryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var slug = request.Name.ToLowerInvariant().Replace(" ", "-");

        var slugExists = await _unitOfWork.Categories.SlugExistsAsync(slug, cancellationToken: cancellationToken);
        if (slugExists)
            throw new ConflictException($"Category '{request.Name}' already exists.");

        var category = new Category
        {
            Name = request.Name,
            Slug = slug,
            Description = request.Description,
            ImageUrl = request.ImageUrl,
            IsActive = true
        };

        await _unitOfWork.Categories.AddAsync(category, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return category.Id;
    }
}
