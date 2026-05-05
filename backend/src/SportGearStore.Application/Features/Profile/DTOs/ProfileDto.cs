namespace SportGearStore.Application.Features.Profile.DTOs;

public record ProfileDto
{
    public Guid     Id        { get; init; }
    public string   Email     { get; init; } = string.Empty;
    public string   FirstName { get; init; } = string.Empty;
    public string   LastName  { get; init; } = string.Empty;
    public string?  Phone     { get; init; }
    public string?  Address   { get; init; }
    public DateTime CreatedAt { get; init; }
}
