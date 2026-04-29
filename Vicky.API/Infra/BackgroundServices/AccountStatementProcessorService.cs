using System.Threading.Channels;
using Vicky.Ledger;
using Vicky.ObjectStorage;

namespace Vicky.API.Infra.BackgroundServices;

public record AccountStatementMessage(
    Guid JobId,
    Guid UserId,
    string FilePath,
    AccountStatementProvider Provider);

public class AccountStatementProcessorService : BackgroundService
{
    private readonly Channel<AccountStatementMessage> _channel;
    private readonly ILogger<AccountStatementProcessorService> _logger;
    private readonly IServiceProvider _serviceProvider;

    public AccountStatementProcessorService(
        ILogger<AccountStatementProcessorService> logger,
        IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
        _channel = Channel.CreateUnbounded<AccountStatementMessage>();
    }

    public async ValueTask QueueBackgroundWorkItemAsync(AccountStatementMessage message)
    {
        await _channel.Writer.WriteAsync(message);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Account Statement Processor Service is starting.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var message = await _channel.Reader.ReadAsync(stoppingToken);
                _logger.LogInformation("Processing job {JobId} for user {UserId} (Provider: {Provider})", 
                    message.JobId, message.UserId, message.Provider);

                using (var scope = _serviceProvider.CreateScope())
                {
                    var reader = scope.ServiceProvider.GetRequiredService<IAccountStatementStreamReader>();
                    var storage = scope.ServiceProvider.GetRequiredService<IObjectStorage>();

                    await foreach (var statement in reader.ReadAsync(message.FilePath, message.Provider).WithCancellation(stoppingToken))
                    {
                        _logger.LogInformation("Processed statement: {Date} - {Amount} - {Description}", 
                            statement.TransactionDate, statement.Amount, statement.Description);
                    }
                }

                _logger.LogInformation("Finished job {JobId}", message.JobId);
            }
            catch (OperationCanceledException)
            {
                _logger.LogError("Operation canceled");
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing account statement message");
            }
        }

        _logger.LogInformation("Account Statement Processor Service is stopping.");
    }
}
