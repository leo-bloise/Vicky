using Microsoft.Extensions.Logging.Console;
using Vicky.API.Infra;
using Vicky.API.Infra.Implementations;
using Vicky.API.Infra.Services;
using Vicky.Common;
using Vicky.Ledger;
using Vicky.Ledger.Commands;
using Vicky.Ledger.Handlers;
using Vicky.Ledger.Queries;
using Vicky.Users;
using Vicky.Users.Commands;
using Vicky.Users.Handlers;
using Vicky.Users.Repositories;
using Vicky.Users.Services;

namespace Vicky.API;

public class Program
{
    public static void Main(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        builder.Logging.ClearProviders();
        builder.Logging.AddSimpleConsole(options =>
        {
            options.IncludeScopes = true;
        });
        builder.Logging.AddDebug();

        builder.Services
            .AddScoped<IDependencyInjectionContainer, DependencyInjectionContainer>();
        builder.Services
            .AddScoped<CommandDispatcher>();
        builder.Services
            .AddScoped<QueryDispatcher>();
        builder.Services
            .AddScoped<ICommandHandler<CreateCounterpartyCommand, Counterparty>, CreateCounterpartyCommandHandler>();
        builder.Services
            .AddScoped<ICommandHandler<CreateTransactionCommand, Transaction>, TransactionCommandHandler>();
        builder.Services
            .AddScoped<ICommandHandler<CreateUserCommand, User>, CreateUserCommandHandler>();
        builder.Services
            .AddScoped<ICommandHandler<LoginUserCommand, Token>, LoginUserCommandHandler>();

        builder.Services
            .AddScoped<IQueryHandler<QueryTransactionsByDateRange, IEnumerable<Transaction>>, QueryTransactionsByDateRangeHandler>();

        builder.Services
            .AddScoped<IQueryHandler<GetTransactionsPagedQuery, PagedResult<Transaction>>, GetTransactionsPagedQueryHandler>();
            
        builder.Services
            .AddScoped<IQueryHandler<GetCounterpartiesPagedQuery, PagedResult<Counterparty>>, GetCounterpartiesPagedQueryHandler>();
        
        builder.Services
            .AddScoped<IQueryHandler<GetCounterpartiesPagedQueryWithCursor, CursorResult<Counterparty>>, GetCounterpartiesPagedQueryWithCursorHandler>();

        builder.Services
            .AddScoped<DatabaseContext>();
        builder.Services
            .AddScoped<ICounterpartyRepository, CounterpartyRepository>();
        builder.Services
            .AddScoped<ITransactionRepository, TransactionRepository>();
        builder.Services
            .AddScoped<IUserRepository, UserRepository>();
        builder.Services
            .AddScoped<ICryptoService, CryptoService>();

        builder
            .AddJwtAuthentication();

        builder
            .ConfigureValidationErrorResponse();
    
        builder.Services.AddSingleton<IVickyLoggerFactory, VickyLoggerFactory>();
    
        builder
            .ConfigureCors();

        WebApplication app = builder.Build();

        app.UseMiddleware<TraceIdLoggingMiddleware>();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseCors();

        app.MapControllers();

        app.Run();
    }
}
