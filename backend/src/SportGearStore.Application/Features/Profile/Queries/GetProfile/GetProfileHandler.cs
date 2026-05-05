using MediatR;
using SportGearStore.Application.Common.Exceptions;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Application.Features.Profile.DTOs;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Application.Features.Profile.Queries.GetProfile;

public class GetProfileHandler : IRequestHandler<GetProfileQuery, ProfileDto>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetProfileHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ProfileDto> Handle(GetProfileQuery request, CancellationToken cancellationToken)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(request.UserId, cancellationToken)
            ?? throw new NotFoundException(nameof(User), request.UserId);

        return new ProfileDto
        {
            Id        = user.Id,
            Email     = user.Email,
            FirstName = user.FirstName,
            LastName  = user.LastName,
            Phone     = user.Phone,
            Address   = user.Address,
            CreatedAt = user.CreatedAt,
        };
    }
}
