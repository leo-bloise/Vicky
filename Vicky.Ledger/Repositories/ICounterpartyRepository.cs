namespace Vicky.Ledger;

public interface ICounterpartyRepository
{
    public Counterparty? FindById(Guid id, Guid userId);

    public Counterparty Save(Counterparty counterparty);

    public Counterparty? FindByName(string name, Guid userId);

    public bool ExistsByName(string name, Guid userId);

    public IEnumerable<Counterparty> GetPaged(Guid userId, int pageNumber, int pageSize);
}