using MediatR;
using SportGearStore.Application.Features.Profile.DTOs;

namespace SportGearStore.Application.Features.Profile.Queries.GetProfile;

public record GetProfileQuery(Guid UserId) : IRequest<ProfileDto>;
