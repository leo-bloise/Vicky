namespace Vicky.Ledger;

public class Counterparty
{
    public Guid Id { get; }

    public string Name { get; }

    public Guid UserId { get; }

    public Counterparty() {}

    public Counterparty(Guid id, string name, Guid userId)
    {
        Id = id;
        Name = name;
        UserId = userId;
    }
}