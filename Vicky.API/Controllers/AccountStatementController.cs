using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicky.API.Infra.BackgroundServices;
using Vicky.Common;
using Vicky.Ledger;
using Vicky.ObjectStorage;
using Vicky.Users;
using Vicky.Users.Adapter;

namespace Vicky.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AccountStatementController : ControllerBase
{
    private readonly IObjectStorage _objectStorage;
    private readonly AccountStatementProcessorService _processorService;
    private readonly IClaimsPrincipalAdapter _claimsPrincipalAdapter;

    public AccountStatementController(
        IObjectStorage objectStorage,
        AccountStatementProcessorService processorService,
        IClaimsPrincipalAdapter claimsPrincipalAdapter)
    {
        _objectStorage = objectStorage;
        _processorService = processorService;
        _claimsPrincipalAdapter = claimsPrincipalAdapter;
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
        var user = _claimsPrincipalAdapter.Adapt();
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
