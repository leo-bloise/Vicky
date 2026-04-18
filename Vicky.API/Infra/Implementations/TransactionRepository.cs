using System.Data;
using Dapper;
using Vicky.Ledger;

namespace Vicky.API.Infra.Implementations;

internal class TransactionRepository(DatabaseContext context): ITransactionRepository
{
    private static readonly string TABLE_NAME = "ledger";

    public IEnumerable<Transaction> GetTransactionsByRangeDate(DateTime startDate, DateTime endDate, Guid userId)
    {
        string sql = @$"SELECT 
                        id AS {nameof(Transaction.Id)}, 
                        amount AS {nameof(Transaction.Amount)}, 
                        counterparty_id AS {nameof(Transaction.CounterpartyId)}, 
                        transaction_date AS {nameof(Transaction.TransactionDate)}, 
                        user_id AS {nameof(Transaction.UserId)} 
                        FROM {TABLE_NAME} 
                        WHERE user_id = @UserId 
                        AND transaction_date >= @StartDate 
                        AND transaction_date <= @EndDate";

        return context.DbConnection.Query<Transaction>(sql, new
        {
            UserId = userId,
            StartDate = startDate,
            EndDate = endDate
        });
    }

    public IEnumerable<Transaction> GetPaged(Guid userId, int pageNumber, int pageSize, DateTime startDate, DateTime endDate)
    {
        int offset = (pageNumber - 1) *  pageSize;

        string sql = @$"
            SELECT 
                id AS {nameof(Transaction.Id)},
                amount AS {nameof(Transaction.Amount)},
                counterparty_id AS {nameof(Transaction.CounterpartyId)},
                user_id AS {nameof(Transaction.UserId)},
                transaction_date AS {nameof(Transaction.TransactionDate)}
            FROM {TABLE_NAME}
            WHERE user_id = @UserId 
                AND transaction_date >= @StartDate 
                AND transaction_date <= @EndDate
            ORDER BY transaction_date ASC LIMIT @PageSize OFFSET @Offset
        ";

        return context.DbConnection.Query<Transaction>(sql, new
        {
           UserId = userId,
           PageSize = pageSize,
           Offset = offset,
           StartDate = startDate,
           EndDate = endDate
        });
    }

    public int GetTotalCount(Guid userId, DateTime startDate, DateTime endDate)
    {
        string sql = @$"SELECT COUNT(*) FROM {TABLE_NAME} 
                        WHERE user_id = @UserId 
                        AND transaction_date >= @StartDate 
                        AND transaction_date <= @EndDate";

        return context.DbConnection.ExecuteScalar<int>(sql, new
        {
            UserId = userId,
            StartDate = startDate,
            EndDate = endDate
        });
    }

    public Transaction Save(Transaction transaction)
    {
        string sql = $"INSERT INTO {TABLE_NAME}(id, amount, counterparty_id, transaction_date, user_id) VALUES(@Id, @Amount, @CounterpartyId, @TransactionDate, @UserId)";

        context.DbConnection.Execute(sql, new
        {
            transaction.Id,
            transaction.Amount,
            transaction.CounterpartyId,
            transaction.TransactionDate,
            transaction.UserId
        });

        return transaction;
    }
}