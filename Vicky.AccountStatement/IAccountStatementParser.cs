namespace Vicky.AccountStatement;

public interface IAccountStatementParser
{
    IEnumerable<IAccountStatement> Parse(Stream stream);
}