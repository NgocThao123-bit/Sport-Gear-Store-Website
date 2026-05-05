using MediatR;
using SportGearStore.Application.Features.Products.DTOs;

namespace SportGearStore.Application.Features.Products.Queries.GetProductBySlug;

public record GetProductBySlugQuery(string Slug) : IRequest<ProductDetailDto>;
