using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicky.API.Infra.Filters;
using Vicky.Common;

namespace Vicky.API;

[ApiController]
[Route("[controller]")]
[Authorize]
public class CsrfTokenController(IAntiforgery antiforgery) : ControllerBase
{
    [HttpPost]
    [IgnoreCsrfToken]
    public IActionResult Create()
    {
        AntiforgeryTokenSet antiforgeryTokenSet = antiforgery.GetAndStoreTokens(HttpContext);

        ApiResponse<string> response = ApiResponse<string>.SuccessResponse(antiforgeryTokenSet.RequestToken!, "CSRF token generated");

        return Created(string.Empty, response);
    }    
}