using Vicky.Common;

namespace Vicky.API.Infra;

internal class DependencyInjectionContainer(IServiceProvider serviceProvider): IDependencyInjectionContainer
{
    public ICommandHandler<R, O>? GetCommandHandler<R, O>()
    {
        return serviceProvider.GetService<ICommandHandler<R, O>>();
    }

    public IQueryHandler<Request, Output>? GetQueryHandler<Request, Output>()
    {
        return serviceProvider.GetService<IQueryHandler<Request, Output>>();
    }
}