using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicky.AccountStatement.AccountStatements;
using Vicky.API.Infra.BackgroundServices;
using Vicky.API.Infra.Filters;
using Vicky.API.Infra.Implementations;
using Vicky.Common;
using Vicky.ObjectStorage;
using Vicky.Users;
using Vicky.Users.Services;

namespace Vicky.API.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class AccountStatementController : ControllerBase
{
    private readonly IObjectStorage _objectStorage;
    private readonly AccountStatementProcessorService _processorService;
    private readonly IJwtTokenService _jwtTokenService;

    public AccountStatementController(
        IObjectStorage objectStorage,
        AccountStatementProcessorService processorService,
        IJwtTokenService jwtTokenService)
    {
        _objectStorage = objectStorage;
        _processorService = processorService;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("{provider}")]
    public async Task<IActionResult> Upload(string provider, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return UnprocessableEntity(ApiResponse<object?>.FailedResponse(null, "The file is empty."));
        }

        if (!Enum.TryParse<AccountStatementProvider>(provider, true, out var statementProvider))
        {
            return BadRequest(ApiResponse<object?>.FailedResponse(null, $"Provider '{provider}' is not supported."));
        }

        var jobId = Guid.NewGuid();
        User? user = _jwtTokenService.Adapt(new ClaimsPrincipalAdapter(User));
        if (user == null) return Unauthorized();
        var userId = user.Id;

        var filePath = await _objectStorage.UploadAsync(file.OpenReadStream(), file.FileName);

        await _processorService.QueueBackgroundWorkItemAsync(new AccountStatementMessage(
            jobId,
            userId,
            filePath,
            statementProvider));

        return Accepted(ApiResponse<object>.SuccessResponse(new { jobId }, "Processing started"));
    }
}
