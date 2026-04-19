using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicky.API.Infra.Implementations;
using Vicky.Common;
using Vicky.Ledger;
using Vicky.Ledger.Commands;
using Vicky.Ledger.Queries;
using Vicky.Users;
using Vicky.Users.Services;

namespace Vicky.API.Controllers;

[ApiController]
[Authorize]
[Route("[controller]")]
public class TransactionController(
    CommandDispatcher dispatcher,
    QueryDispatcher queryDispatcher,
    IJwtTokenService jwtTokenService): ControllerBase
{
    [HttpPost]
    public IActionResult Create([FromBody] CreateTransactionRequest request)
    {
        User? user = jwtTokenService.Adapt(new ClaimsPrincipalAdapter(User));

        if (user == null)
        {
            return Unauthorized();
        }

        CreateTransactionCommand command = new (
            request.CounterpartyId,
            user.Id,
            request.Amount,
            request.TransactionDate
        );

        Transaction transaction = dispatcher.Dispatch<CreateTransactionCommand, Transaction>(command);

        var response = new
        {
            transaction.Id,
            transaction.CounterpartyId,
            transaction.Amount,
            transaction.TransactionDate
        };

        return CreatedAtAction(nameof(Create), ApiResponse<object>.SuccessResponse(response, "Transaction created successfully"));
    }

    [HttpGet]
    public IActionResult GetByDateRange([FromQuery] GetTransactionsRequest request)
    {
        User? user = jwtTokenService.Adapt(new ClaimsPrincipalAdapter(User));

        if (user == null)
        {
            return Unauthorized();
        }

        QueryTransactionsByDateRange query = new(request.StartDate!.Value, request.EndDate!.Value, user.Id);
        IEnumerable<Transaction> transactions = queryDispatcher.Dispatch<QueryTransactionsByDateRange, IEnumerable<Transaction>>(query);

        var response = transactions.Select(t => new
        {
            t.Id,
            t.Amount,
            t.CounterpartyId,
            t.TransactionDate
        });

        return Ok(ApiResponse<object>.SuccessResponse(response, "Transactions retrieved successfully"));
    }

    [HttpGet("paged")]
    public IActionResult GetPaged([FromQuery] GetTransactionsPagedRequest request)
    {
        User? user = jwtTokenService.Adapt(new ClaimsPrincipalAdapter(User));

        if (user == null)
        {
            return Unauthorized();
        }

        GetTransactionsPagedQuery query = new(
            user.Id,
            request.PageNumber,
            request.PageSize,
            request.StartDate,
            request.EndDate
        );

        PagedResult<Transaction> result = queryDispatcher.Dispatch<GetTransactionsPagedQuery, PagedResult<Transaction>>(query);

        return Ok(ApiResponse<PagedResult<Transaction>>.SuccessResponse(result, "Transactions retrieved successfully"));
    }
}