using Vicky.Common;
using Vicky.Users.Services;

namespace Vicky.API.Infra;

public class VickyLogger<T> : IVickyLogger<T>
{
    private readonly ILogger<T> _logger;

    public VickyLogger(ILogger<T> logger)
    {
        _logger = logger;
    }

    public void LogInformation(string message, params object[] args)
    {
        _logger.LogInformation(message, args);
    }

    public void LogWarning(string message, params object[] args)
    {
        _logger.LogWarning(message, args);
    }

    public void LogError(string message, params object[] args)
    {
        _logger.LogError(message, args);
    }

    public void LogError(Exception exception, string message, params object[] args)
    {
        _logger.LogError(exception, message, args);
    }
}

public class VickyLoggerFactory : IVickyLoggerFactory
{
    private readonly ILoggerFactory _loggerFactory;

    public VickyLoggerFactory(ILoggerFactory loggerFactory)
    {
        _loggerFactory = loggerFactory;
    }

    public IVickyLogger<T> CreateLogger<T>()
    {
        var logger = _loggerFactory.CreateLogger<T>();
        return new VickyLogger<T>(logger);
    }
}