namespace Vicky.AccountStatement;

public interface IAccountStatement
{
    DateTime TransactionDate { get; }
    decimal Amount { get; }
    string Identifier { get; }
    string Description { get; }
}
