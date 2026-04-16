using Vicky.Users.Adapter;

namespace Vicky.Users.Services;

public interface IJwtTokenService
{
    Token GenerateToken(User user);
    User? Adapt(IClaimsPrincipalAdapter adapter);
}
