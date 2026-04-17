using Vicky.Common;
using Vicky.Ledger.Queries;

namespace Vicky.Ledger.Handlers;

public sealed class GetCounterpartiesPagedQueryHandler(ICounterpartyRepository counterpartyRepository) : IQueryHandler<GetCounterpartiesPagedQuery, IEnumerable<Counterparty>>
{
    public IEnumerable<Counterparty> Execute(GetCounterpartiesPagedQuery request)
    {
        return counterpartyRepository.GetPaged(request.UserId, request.PageNumber, request.PageSize);
    }
}