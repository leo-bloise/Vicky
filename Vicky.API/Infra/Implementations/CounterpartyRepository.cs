using Dapper;
using Vicky.Ledger;

namespace Vicky.API.Infra.Implementations;

internal class CounterpartyRepository(DatabaseContext context) : ICounterpartyRepository
{
    private const string TableName = "counterparties";

    public bool ExistsByName(string name, Guid userId)
    {
        string sql = $"SELECT 1 FROM {TableName} WHERE name = @Name AND user_id = @UserId";

        IEnumerable<int> exists = context.DbConnection.Query<int>(sql, new
        {
            Name = name,
            UserId = userId
        });

        return exists.FirstOrDefault(0) == 1;
    }

    public Counterparty? FindById(Guid id, Guid userId)
    {
        string sql = @$"SELECT 
                        id AS {nameof(Counterparty.Id)}, 
                        name AS {nameof(Counterparty.Name)}, 
                        user_id AS {nameof(Counterparty.UserId)} 
                        FROM {TableName} 
                        WHERE id = @Id AND user_id = @UserId LIMIT 1";
        return context.DbConnection.QuerySingleOrDefault<Counterparty>(sql, new { Id = id, UserId = userId });
    }

    public Counterparty? FindByName(string name, Guid userId)
    {
        string sql = @$"SELECT 
                        id AS {nameof(Counterparty.Id)}, 
                        name AS {nameof(Counterparty.Name)}, 
                        user_id AS {nameof(Counterparty.UserId)} 
                        FROM {TableName} 
                        WHERE name = @Name AND user_id = @UserId LIMIT 1";
        return context.DbConnection.QuerySingleOrDefault<Counterparty>(sql, new { Name = name, UserId = userId });
    }

    public Counterparty Save(Counterparty counterparty)
    {
        string sql = @$"INSERT INTO {TableName} (id, name, user_id) 
                        VALUES (@Id, @Name, @UserId) 
                        RETURNING 
                        id AS {nameof(Counterparty.Id)}, 
                        name AS {nameof(Counterparty.Name)}, 
                        user_id AS {nameof(Counterparty.UserId)}";
        return context.DbConnection.QuerySingle<Counterparty>(sql, new { counterparty.Id, counterparty.Name, counterparty.UserId });
    }

    public IEnumerable<Counterparty> GetPaged(Guid userId, int pageNumber, int pageSize)
    {
        int offset = (pageNumber - 1) * pageSize;
        string sql = @$"SELECT 
                        id AS {nameof(Counterparty.Id)}, 
                        name AS {nameof(Counterparty.Name)}, 
                        user_id AS {nameof(Counterparty.UserId)}                         
                        FROM {TableName} 
                        WHERE user_id = @UserId 
                        ORDER BY name ASC 
                        LIMIT @PageSize OFFSET @Offset";
        return context.DbConnection.Query<Counterparty>(sql, new { UserId = userId, PageSize = pageSize, Offset = offset });
    }

    public int GetTotalCount(Guid userId)
    {
        string sql = $"SELECT COUNT(*) FROM {TableName} WHERE user_id = @UserId";
        return context.DbConnection.ExecuteScalar<int>(sql, new { UserId = userId });
    }
}
