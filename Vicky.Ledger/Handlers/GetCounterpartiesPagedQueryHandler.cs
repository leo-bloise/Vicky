using Vicky.Common;
using Vicky.Ledger.Queries;

namespace Vicky.Ledger.Handlers;

public sealed class GetCounterpartiesPagedQueryHandler(ICounterpartyRepository counterpartyRepository) : IQueryHandler<GetCounterpartiesPagedQuery, PagedResult<Counterparty>>
{
    public PagedResult<Counterparty> Execute(GetCounterpartiesPagedQuery request)
    {
        var data = counterpartyRepository.GetPaged(request.UserId, request.PageNumber, request.PageSize);
        var totalItems = counterpartyRepository.GetTotalCount(request.UserId);
        var totalPages = (int)Math.Ceiling((double)totalItems / request.PageSize);
        
        return new PagedResult<Counterparty>(
            CurrentPage: request.PageNumber,
            TotalPages: totalPages,
            TotalItems: totalItems,
            Data: data
        );
    }
}