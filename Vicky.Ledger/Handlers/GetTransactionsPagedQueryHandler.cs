using Vicky.Common;
using Vicky.Ledger.Queries;

namespace Vicky.Ledger.Handlers;

public sealed class GetTransactionsPagedQueryHandler(ITransactionRepository transactionRepository) : IQueryHandler<GetTransactionsPagedQuery, PagedResult<Transaction>>
{
    public PagedResult<Transaction> Execute(GetTransactionsPagedQuery request)
    {
        var data = transactionRepository.GetPaged(request.UserId, request.PageNumber, request.PageSize, request.StartDate, request.EndDate);
        var totalItems = transactionRepository.GetTotalCount(request.UserId, request.StartDate, request.EndDate);
        var totalPages = (int)Math.Ceiling((double)totalItems / request.PageSize);
        
        return new PagedResult<Transaction>(
            CurrentPage: request.PageNumber,
            TotalPages: totalPages,
            TotalItems: totalItems,
            Data: data
        );
    }
}