using Vicky.Common;
using Vicky.Common.Exceptions;
using Vicky.Ledger.Commands;

namespace Vicky.Ledger.Handlers;

public class CreateCounterpartyCommandHandler(ICounterpartyRepository counterpartyRepository) : ICommandHandler<CreateCounterpartyCommand, Counterparty>
{
    public Counterparty Handle(CreateCounterpartyCommand request)
    {
        if(counterpartyRepository.ExistsByName(request.Name, request.UserId)) throw new DomainException("Counterparty name already taken");

        Counterparty counterparty = new Counterparty(
            Guid.NewGuid(),
            request.Name,
            request.UserId
        );

        return counterpartyRepository.Save(counterparty);
    }
}