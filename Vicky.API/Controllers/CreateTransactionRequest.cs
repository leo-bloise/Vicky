using System.ComponentModel.DataAnnotations;

namespace Vicky.API.Controllers;

public record CreateTransactionRequest(
    [Required]
    decimal Amount,
    [Required]
    Guid CounterpartyId,
    [Required]
    DateTime TransactionDate
) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if(Amount <=0)
        {
            yield return new ValidationResult("Amount must be bigger than 0", [nameof(Amount)]);
        }
    }
};