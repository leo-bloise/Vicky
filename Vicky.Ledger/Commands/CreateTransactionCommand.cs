namespace Vicky.Ledger.Commands;

public record CreateTransactionCommand(
    Guid CounterpartyId,
    Guid UserId,
    decimal Amount,
    DateTime TransactionDate
);