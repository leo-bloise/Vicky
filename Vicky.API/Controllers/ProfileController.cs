using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicky.API.Infra.Implementations;
using Vicky.Common;
using Vicky.Users.Services;

namespace Vicky.API.Controllers;

[ApiController]
[Authorize]
[Route("[controller]")]
public class ProfileController(IJwtTokenService jwtTokenService) : ControllerBase
{
    [HttpGet("me")]
    public IActionResult Me()
    {
        Users.User? user = jwtTokenService.Adapt(new ClaimsPrincipalAdapter(User));

        if (user == null)
        {
            return Unauthorized();
        }

        return Ok(ApiResponse<object>.SuccessResponse(new
        {
            user.Id,
            user.Username
        }, "Profile retrieved successfully"));
    }
}