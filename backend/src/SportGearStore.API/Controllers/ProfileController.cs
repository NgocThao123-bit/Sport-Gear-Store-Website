using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportGearStore.Application.Common.Interfaces.Services;
using SportGearStore.Application.Features.Profile.Commands.UpdateProfile;
using SportGearStore.Application.Features.Profile.Queries.GetProfile;

namespace SportGearStore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly ISender _sender;
    private readonly ICurrentUserService _currentUser;

    public ProfileController(ISender sender, ICurrentUserService currentUser)
    {
        _sender = sender;
        _currentUser = currentUser;
    }

    // GET /api/profile
    [HttpGet]
    public async Task<IActionResult> GetProfile(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new GetProfileQuery(_currentUser.UserId!.Value),
            cancellationToken);
        return Ok(result);
    }

    // PUT /api/profile
    [HttpPut]
    public async Task<IActionResult> UpdateProfile(
        [FromBody] UpdateProfileRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(
            new UpdateProfileCommand(
                _currentUser.UserId!.Value,
                request.FirstName,
                request.LastName,
                request.Phone,
                request.Address),
            cancellationToken);
        return Ok(result);
    }
}

public record UpdateProfileRequest(
    string  FirstName,
    string  LastName,
    string? Phone,
    string? Address
);
