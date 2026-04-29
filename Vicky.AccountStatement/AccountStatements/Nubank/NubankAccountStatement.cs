namespace Vicky.AccountStatement.AccountStatements.Nubank;

public class NubankAccountStatement : IAccountStatement
{
    public DateTime TransactionDate { get; init; }
    public decimal Amount { get; init; }
    public string Identifier { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
}