using Vicky.Ledger;

namespace Vicky.ObjectStorage;

public interface IAccountStatementStreamReader
{
    IAsyncEnumerable<IAccountStatement> ReadAsync(string filePath, AccountStatementProvider provider);
}