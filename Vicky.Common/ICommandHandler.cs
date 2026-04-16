namespace Vicky.Common;

public interface ICommandHandler<R, O>
{
    public O Handle(R request);
}
