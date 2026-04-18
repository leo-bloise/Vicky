using Vicky.Common;

namespace Vicky.Ledger.Queries;

public record GetCounterpartiesPagedQueryWithCursor(
    Guid UserId,
    int Limit,
    DatabaseCursorToken? Token,
    string? Name = null
);