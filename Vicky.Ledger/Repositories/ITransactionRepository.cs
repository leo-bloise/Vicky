namespace Vicky.Ledger;

public interface ITransactionRepository
{
    public Transaction Save(Transaction transaction);

    public IEnumerable<Transaction> GetTransactionsByRangeDate(DateTime startDate, DateTime endDate, Guid userId);
}