using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Vicky.API.Infra.Filters;
using Vicky.API.Infra.Services;
using Vicky.Common;
using Vicky.Users;
using Vicky.Users.Commands;

namespace Vicky.API.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController: ControllerBase
{
    private readonly CommandDispatcher _commandDispatcher;    
    
    private readonly IWebHostEnvironment _environment;

    private readonly IOptions<JwtOptions> _options;

    private readonly IAntiforgery _antiforgery;

    public UserController(CommandDispatcher commandDispatcher, IWebHostEnvironment environment, IOptions<JwtOptions> options, IAntiforgery antiforgery)
    {
        _commandDispatcher = commandDispatcher;
        _environment = environment;
        _options = options;
        _antiforgery = antiforgery;
    }

    [HttpPost("register")]
    [IgnoreCsrfToken]
    public IActionResult Register([FromBody] RegisterUserRequest request)
    {
        CreateUserCommand command = new(request.Username, request.Password);
        User user = _commandDispatcher.Dispatch<CreateUserCommand, User>(command);

        var userResponse = new
        {
            id = user.Id,
            username = user.Username
        };

        return CreatedAtAction(nameof(Register), ApiResponse<object>.SuccessResponse(userResponse, "User registered successfully"));
    }

    [HttpPost("login")]
    [IgnoreCsrfToken]
    public IActionResult Login([FromBody] LoginUserRequest request) 
    {
        LoginUserCommand command = new(request.Username, request.Password);

        Token token = _commandDispatcher.Dispatch<LoginUserCommand, Token>(command);

        SetCookie(token);

        return Ok(ApiResponse<object?>.SuccessResponse(null, "Logged in successfully"));
    }

    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout()
    {
        CookieOptions cookieOptions = new()
        {
            HttpOnly = true,
            Secure = _environment.IsProduction(),
            SameSite = _environment.IsProduction() ? SameSiteMode.None : SameSiteMode.Lax,
            Path = "/"
        };

        Response.Cookies.Delete("access_token", cookieOptions);

        return Ok();
    }

    private void SetCookie(Token token)
    {
        CookieOptions cookieOptions = new CookieOptions()
        {
            HttpOnly = true,
            Secure = _environment.IsProduction() && !_environment.IsStaging(),
            SameSite = _environment.IsProduction() && !_environment.IsStaging() ? SameSiteMode.None : SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddHours(_options.Value.ExpirationHours),
            Path = "/"
        };

        Response.Cookies.Append("access_token", token.Payload, cookieOptions);
    }
}