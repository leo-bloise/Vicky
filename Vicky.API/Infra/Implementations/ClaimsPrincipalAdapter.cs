using System.Security.Claims;
using Vicky.Users;
using Vicky.Users.Adapter;

namespace Vicky.API.Infra.Implementations;

public sealed class ClaimsPrincipalAdapter(ClaimsPrincipal principal) : IClaimsPrincipalAdapter
{
    public User? Adapt()
    {
        string? id = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        string? username = principal.FindFirst(ClaimTypes.Name)?.Value;

        if (id == null || username == null)
        {
            return null;
        }

        return new User(Guid.Parse(id), username, string.Empty);
    }
}