using System.Data;
using Npgsql;

namespace Vicky.API.Infra;

internal class DatabaseContext
{
    private readonly IDbConnection _dbConnection;

    public IDbConnection DbConnection { get => _dbConnection; }

    public DatabaseContext(IConfiguration configuration)
    {
        string? connectionString = configuration.GetConnectionString("DefaultConnection");
        ArgumentNullException.ThrowIfNull(connectionString);
        _dbConnection = new NpgsqlConnection(connectionString);
    }
}