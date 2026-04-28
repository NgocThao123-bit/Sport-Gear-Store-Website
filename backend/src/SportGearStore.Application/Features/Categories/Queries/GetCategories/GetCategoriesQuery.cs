using MediatR;
using SportGearStore.Application.Features.Categories.DTOs;

namespace SportGearStore.Application.Features.Categories.Queries.GetCategories;

public record GetCategoriesQuery : IRequest<List<CategoryDto>>;
