using Vicky.Ledger;
using Vicky.ObjectStorage;

namespace Vicky.API.Infra.Services;

public class AccountStatementStreamReader : IAccountStatementStreamReader
{
    private readonly IServiceProvider _serviceProvider;

    public AccountStatementStreamReader(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async IAsyncEnumerable<IAccountStatement> ReadAsync(string filePath, AccountStatementProvider provider)
    {
        if (!File.Exists(filePath)) yield break;

        var parser = GetParser(provider);
        using (var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
        {
            foreach (var statement in parser.Parse(stream))
            {
                yield return statement;
                await Task.Yield(); // Keep it async-friendly
            }
        }
    }

    private IAccountStatementParser GetParser(AccountStatementProvider provider)
    {
        return provider switch
        {
            AccountStatementProvider.Nubank => new NubankAccountStatementParser(),
            _ => throw new NotSupportedException($"Provider {provider} not supported yet.")
        };
    }
}
