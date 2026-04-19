using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicky.API.Infra.Implementations;
using Vicky.Common;
using Vicky.Ledger;
using Vicky.Ledger.Queries;
using Vicky.Users.Services;

namespace Vicky.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class ReportController(QueryDispatcher queryDispatcher, IJwtTokenService jwtTokenService): ControllerBase
{
    [HttpPost("calculate")]
    public IActionResult Calculate([FromBody] MonthReportRequest request)
    {
        Users.User? user = jwtTokenService.Adapt(new ClaimsPrincipalAdapter(User));

        if(user is null)
        {
            return Unauthorized();
        }

        GetMonthReport query = new GetMonthReport(request.Month, request.Year, user.Id);

        Report report = queryDispatcher.Dispatch<GetMonthReport, Report>(query);

        return Ok(ApiResponse<object>.SuccessResponse(report, "Report calculated"));
    }
}