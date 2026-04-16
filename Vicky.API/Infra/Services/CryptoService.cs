using Vicky.Users;
using Vicky.Users.Services;

namespace Vicky.API.Infra.Services;

internal class CryptoService : ICryptoService
{
    private const int BcryptWorkFactor = 12;

    public string Encrypt(User user, string plainPassword)
    {
        return BCrypt.Net.BCrypt.HashPassword(plainPassword, BcryptWorkFactor);
    }

    public bool Compare(User user, string plainPassword)
    {
        return BCrypt.Net.BCrypt.Verify(plainPassword, user.Password);
    }
}
