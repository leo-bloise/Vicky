using Vicky.Common;
using Vicky.Ledger.Queries;

namespace Vicky.Ledger.Handlers;

public sealed class GetCounterpartiesPagedQueryWithCursorHandler(ICounterpartyRepository counterpartyRepository) : IQueryHandler<GetCounterpartiesPagedQueryWithCursor, CursorResult<Counterparty>>
{
    public CursorResult<Counterparty> Execute(GetCounterpartiesPagedQueryWithCursor request)
    {
        var counterparties = counterpartyRepository.GetCursorData(request.UserId, request.Limit + 1, request.Token, request.Name).ToList();

        bool hasNextPage = counterparties.Count > request.Limit;
        
        if (hasNextPage)
        {
            counterparties.RemoveAt(request.Limit);
        }

        Counterparty? lastCounterparty = counterparties.LastOrDefault();

        DatabaseCursorToken? continuationToken = hasNextPage && lastCounterparty is not null 
            ? new DatabaseCursorToken("Cursor", $"{lastCounterparty.Name}|{lastCounterparty.Id}") 
            : null;

        return new CursorResult<Counterparty>(counterparties, continuationToken);
    }
}
