using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicky.API.Infra.Implementations;
using Vicky.Common;
using Vicky.Ledger;
using Vicky.Ledger.Commands;
using Vicky.Users;
using Vicky.Users.Services;

namespace Vicky.API.Controllers;

[ApiController]
[Authorize]
[Route("[controller]")]
public class CounterpartyController(CommandDispatcher commandDispatcher, IJwtTokenService jwtTokenService) : ControllerBase
{
    [HttpPost]
    public IActionResult Create([FromBody] CreateCounterpartyRequest request)
    {
        User? user = jwtTokenService.Adapt(new ClaimsPrincipalAdapter(User));

        if (user == null)
        {
            return Unauthorized();
        }

        CreateCounterpartyCommand command = new CreateCounterpartyCommand(request.Name, user.Id);
        Counterparty counterparty = commandDispatcher.Dispatch<CreateCounterpartyCommand, Counterparty>(command);

        var response = new
        {
            counterparty.Id,
            counterparty.Name
        };

        return CreatedAtAction(nameof(Create), ApiResponse<object>.SuccessResponse(response, "Counterparty created successfully"));
    }
}