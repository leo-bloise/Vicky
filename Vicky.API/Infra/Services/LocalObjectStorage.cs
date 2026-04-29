using Vicky.ObjectStorage;

namespace Vicky.API.Infra.Services;

public class LocalObjectStorage : IObjectStorage
{
    private readonly string _uploadFolder;

    public LocalObjectStorage(IWebHostEnvironment env)
    {
        _uploadFolder = Path.Combine(env.ContentRootPath, "uploads");
        if (!Directory.Exists(_uploadFolder))
        {
            Directory.CreateDirectory(_uploadFolder);
        }
    }

    public async Task<string> UploadAsync(Stream fileStream, string fileName)
    {
        var filePath = Path.Combine(_uploadFolder, $"{Guid.NewGuid()}_{fileName}");
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await fileStream.CopyToAsync(stream);
        }
        return filePath;
    }

    public void Delete(string filePath)
    {
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }
    }
}
