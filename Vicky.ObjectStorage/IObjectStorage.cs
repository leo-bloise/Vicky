using Vicky.Ledger;

namespace Vicky.ObjectStorage;

public interface IObjectStorage
{
    Task<string> UploadAsync(Stream fileStream, string fileName);
    void Delete(string filePath);
}
