namespace Vicky.Users.Services;

public interface ICryptoService
{
    public string Encrypt(User user, string plainPassword);

    public bool Compare(User user, string plainPassword);
}