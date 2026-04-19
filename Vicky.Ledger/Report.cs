namespace Vicky.Ledger;

public class Report
{
    public decimal Incoming { get; private set; } = 0;

    public decimal Outgoing { get; private set; } = 0;

    public decimal Balance { get => Incoming + Outgoing; }

    public Dictionary<DateOnly, IEnumerable<Transaction>> TransactionsByDate { get; private set;} = new();

    private void AggregateByDate(Transaction transaction)
    {
        DateOnly date = new DateOnly(transaction.TransactionDate.Year, transaction.TransactionDate.Month, transaction.TransactionDate.Day);

        if(TransactionsByDate.ContainsKey(date))
        {
            TransactionsByDate[date] = TransactionsByDate[date].Append(transaction);
            return;
        }

        TransactionsByDate[date] = [transaction];
    }

    public void Incorporate(Transaction transaction)
    {
        if(transaction.Amount > 0)
        {
            Incoming += transaction.Amount;
        } else
        {
            Outgoing += transaction.Amount;
        }

        AggregateByDate(transaction);
    }
}