namespace Vicky.Ledger.Commands;

public record CreateCounterpartyCommand(string Name, Guid UserId);