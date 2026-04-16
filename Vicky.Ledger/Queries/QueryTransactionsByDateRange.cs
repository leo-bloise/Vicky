namespace Vicky.Ledger.Queries;

public record QueryTransactionsByDateRange(
    DateTime StartDate,
    DateTime EndDate,
    Guid UserId
);