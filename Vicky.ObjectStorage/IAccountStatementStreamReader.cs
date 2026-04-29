using Vicky.AccountStatement;
using Vicky.AccountStatement.AccountStatements;

namespace Vicky.ObjectStorage;

public interface IAccountStatementStreamReader
{
    IAsyncEnumerable<IAccountStatement> ReadAsync(string filePath, AccountStatementProvider provider);
}