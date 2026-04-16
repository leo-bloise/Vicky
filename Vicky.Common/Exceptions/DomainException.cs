using System.Diagnostics;

namespace Vicky.Common.Exceptions;

public class DomainException : Exception
{
    public Dictionary<string, string[]> Messages = new Dictionary<string, string[]>();

    public IEnumerable<string> Errors => Messages.SelectMany(kvp => kvp.Value);

    public DomainException(string message): base(message) {}

    public void Add(string name, string message)
    {
        if(!Messages.ContainsKey(name))
        {
            Messages.Add(name, [message]);
            return;
        };

        Messages[name] = Messages[name].Append(message).ToArray();
    }

    public ProblemDetails ToProblemDetails(int status = 400, string? instance = null, string? traceId = null)
    {
        traceId ??= Activity.Current?.Id;
        
        return new ProblemDetails(
            Type: "https://tools.ietf.org/html/rfc7231#section-6.5.1",
            Title: "Bad Request",
            Detail: Message,
            Status: status,
            Instance: instance,
            Extensions: new Dictionary<string, object?> { { "errors", Errors.ToList() }, { "traceId", traceId } }
        );
    }
}