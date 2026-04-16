namespace Vicky.Ledger;

public class Transaction
{
    public Guid Id { get; }

    public decimal Amount { get; } = 0;

    public Guid CounterpartyId { get; } = Guid.Empty;

    public DateTime TransactionDate { get; }

    public Guid UserId { get; }

    public Transaction() {}

    public Transaction(Guid id, decimal amount, Guid counterpartyId, DateTime transactionDate, Guid userId)
    {
        Id = id;
        Amount = amount;
        CounterpartyId = counterpartyId;
        TransactionDate = transactionDate;
        UserId = userId;
    }
}
