using Microsoft.AspNetCore.Mvc;
using Vicky.Common;
using Vicky.Users;
using Vicky.Users.Commands;

namespace Vicky.API.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly CommandDispatcher _commandDispatcher;    

    public UserController(CommandDispatcher commandDispatcher)
    {
        _commandDispatcher = commandDispatcher;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterUserRequest request)
    {
        CreateUserCommand command = new CreateUserCommand(request.Username, request.Password);
        User user = _commandDispatcher.Dispatch<CreateUserCommand, User>(command);

        var userResponse = new
        {
            id = user.Id,
            username = user.Username
        };

        return CreatedAtAction(nameof(Register), ApiResponse<object>.SuccessResponse(userResponse, "User registered successfully"));
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginUserRequest request) 
    {
        LoginUserCommand command = new LoginUserCommand(request.Username, request.Password);

        Token token = _commandDispatcher.Dispatch<LoginUserCommand, Token>(command);

        var response = new
        {
            Token = token  
        };

        return Ok(ApiResponse<object>.SuccessResponse(response, "Logged in successfully"));
    }
}