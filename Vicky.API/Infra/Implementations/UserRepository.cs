using Dapper;
using Vicky.Users;
using Vicky.Users.Repositories;

namespace Vicky.API.Infra.Implementations;

internal class UserRepository(DatabaseContext context): IUserRepository
{
    private static readonly string TABLE_NAME = "users";

    public bool ExistsByUsername(string username)
    {
        string sql = $"SELECT 1 FROM {TABLE_NAME} WHERE username = @Username";

        IEnumerable<int> exists = context.DbConnection.Query<int>(sql, new
        {
            Username = username
        });

        return exists.FirstOrDefault(0) == 1;
    }

    public User? FindById(Guid id)
    {
        string sql = $"SELECT * FROM {TABLE_NAME} WHERE id = @Id LIMIT 1";

        IEnumerable<User> users = context.DbConnection.Query<User>(sql, new { Id = id });

        return users.FirstOrDefault();
    }

    public User? FindByUsername(string username)
    {
        string sql = $"SELECT * FROM {TABLE_NAME} WHERE username = @Username";

        IEnumerable<User> users = context.DbConnection.Query<User>(sql, new
        {
            Username = username
        });

        return users.FirstOrDefault();
    }

    public User Save(User user)
    {
        string sql = "INSERT INTO users(id, username, password) VALUES(@Id, @Username, @Password)";

        context.DbConnection.Execute(sql, user);

        return user;
    }
}