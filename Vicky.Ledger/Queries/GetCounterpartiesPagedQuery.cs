namespace Vicky.Ledger.Queries;

public record GetCounterpartiesPagedQuery(
    Guid UserId,
    int PageNumber,
    int PageSize,
    string? Name = null
);