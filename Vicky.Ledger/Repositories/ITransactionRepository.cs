namespace Vicky.Ledger;

public interface ITransactionRepository
{
    public Transaction Save(Transaction transaction);

    public IEnumerable<Transaction> GetTransactionsByRangeDate(DateTime startDate, DateTime endDate, Guid userId);

    public IEnumerable<Transaction> GetPaged(Guid userId, int pageNumber, int pageSize, DateTime startDate, DateTime endDate);

    public int GetTotalCount(Guid userId, DateTime startDate, DateTime endDate);
}