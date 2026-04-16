namespace Vicky.Users.Repositories;

public interface IUserRepository
{
    public bool ExistsByUsername(string username);

    public User? FindByUsername(string username);

    public User? FindById(Guid id);

    public User Save(User user);
}