namespace Vicky.Common;

public class CommandDispatcher(IDependencyInjectionContainer dependencyInjectionContainer)
{
    public O Dispatch<R, O>(R request)
    {
        ICommandHandler<R, O>? commandHandler = dependencyInjectionContainer.GetCommandHandler<R, O>();

        ArgumentNullException.ThrowIfNull(commandHandler);

        return commandHandler.Handle(request);
    }
}