namespace Vicky.Ledger.Queries;

public record GetTransactionsPagedQuery(
    Guid UserId,
    int PageNumber,
    int PageSize,
    DateTime StartDate,
    DateTime EndDate
);