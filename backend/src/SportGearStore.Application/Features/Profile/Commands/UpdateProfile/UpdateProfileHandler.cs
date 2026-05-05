using MediatR;
using SportGearStore.Application.Common.Exceptions;
using SportGearStore.Application.Common.Interfaces;
using SportGearStore.Application.Features.Profile.DTOs;
using SportGearStore.Domain.Entities;

namespace SportGearStore.Application.Features.Profile.Commands.UpdateProfile;

public class UpdateProfileHandler : IRequestHandler<UpdateProfileCommand, ProfileDto>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateProfileHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ProfileDto> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(request.UserId, cancellationToken)
            ?? throw new NotFoundException(nameof(User), request.UserId);

        user.FirstName = request.FirstName.Trim();
        user.LastName  = request.LastName.Trim();
        user.Phone     = string.IsNullOrWhiteSpace(request.Phone)   ? null : request.Phone.Trim();
        user.Address   = string.IsNullOrWhiteSpace(request.Address) ? null : request.Address.Trim();
        user.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

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
