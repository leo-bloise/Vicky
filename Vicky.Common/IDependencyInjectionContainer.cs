namespace Vicky.Common;

public interface IDependencyInjectionContainer
{
    public ICommandHandler<R, O>? GetCommandHandler<R, O>();

    public IQueryHandler<Request, Output>? GetQueryHandler<Request, Output>();
}