using Vicky.Common;
using Vicky.Common.Exceptions;
using Vicky.Ledger.Commands;

namespace Vicky.Ledger.Handlers;

public class TransactionCommandHandler(
    ITransactionRepository transactionRepository, 
    ICounterpartyRepository counterpartyRepository
) : ICommandHandler<CreateTransactionCommand, Transaction>
{
    public Transaction Handle(CreateTransactionCommand request)
    {
        Counterparty? counterparty = counterpartyRepository.FindById(request.CounterpartyId, request.UserId);

        if (counterparty == null) throw new DomainException("Counterparty not found.");

        if(request.TransactionDate == DateTime.MinValue) throw new DomainException("Invalid transaction date provided.");

        Transaction transaction = new Transaction(
            Guid.NewGuid(), 
            request.Amount, 
            request.CounterpartyId, 
            request.TransactionDate,
            request.UserId
        );

        return transactionRepository.Save(transaction);
    }
}