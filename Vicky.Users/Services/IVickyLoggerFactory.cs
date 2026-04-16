using Vicky.Common;

namespace Vicky.Users.Services;

public interface IVickyLoggerFactory
{
    IVickyLogger<T> CreateLogger<T>();
}