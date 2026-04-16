using System.Diagnostics;

namespace Vicky.API.Infra;

public class TraceIdLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<TraceIdLoggingMiddleware> _logger;

    public TraceIdLoggingMiddleware(RequestDelegate next, ILogger<TraceIdLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        string traceId = context.TraceIdentifier;

        using (_logger.BeginScope(new Dictionary<string, object> { ["TraceId"] = traceId }))
        {
            await _next(context);
        }
    }
}