using Vicky.Common;
using Vicky.Ledger.Queries;

namespace Vicky.Ledger.Handlers;

public sealed class QueryTransactionsByDateRangeHandler(ITransactionRepository transactionRepository): IQueryHandler<QueryTransactionsByDateRange, IEnumerable<Transaction>>
{
    public IEnumerable<Transaction> Execute(QueryTransactionsByDateRange request)
    {
        return transactionRepository.GetTransactionsByRangeDate(request.StartDate, request.EndDate, request.UserId);
    }
}