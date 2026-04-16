namespace Vicky.Common;

public interface IQueryHandler<Request, Output>
{
    Output Execute(Request request);
}