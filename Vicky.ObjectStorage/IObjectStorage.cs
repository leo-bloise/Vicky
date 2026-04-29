using Vicky.Ledger;

namespace Vicky.ObjectStorage;

public interface IAccountStatementStreamReader
{
    IAsyncEnumerable<IAccountStatement> ReadAsync(string filePath, AccountStatementProvider provider);
}

public interface IObjectStorage
{
    Task<string> UploadAsync(Stream fileStream, string fileName);
    void Delete(string filePath);
}
