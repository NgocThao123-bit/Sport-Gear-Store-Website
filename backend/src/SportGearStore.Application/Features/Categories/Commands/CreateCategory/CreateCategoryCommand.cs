using MediatR;

namespace SportGearStore.Application.Features.Categories.Commands.CreateCategory;

public record CreateCategoryCommand(
    string Name,
    string? Description,
    string? ImageUrl
) : IRequest<Guid>;
