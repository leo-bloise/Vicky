namespace Vicky.Common;

public class QueryDispatcher(IDependencyInjectionContainer dependencyInjectionContainer)
{ 
    public Output Dispatch<Request, Output>(Request request)
    {
        IQueryHandler<Request, Output>? queryHandler = dependencyInjectionContainer.GetQueryHandler<Request, Output>();

        ArgumentNullException.ThrowIfNull(queryHandler);

        return queryHandler.Execute(request);
    }
}