using MediatR;
using SportGearStore.Application.Features.Profile.DTOs;

namespace SportGearStore.Application.Features.Profile.Commands.UpdateProfile;

public record UpdateProfileCommand(
    Guid    UserId,
    string  FirstName,
    string  LastName,
    string? Phone,
    string? Address
) : IRequest<ProfileDto>;
