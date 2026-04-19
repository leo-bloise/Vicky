using System.ComponentModel.DataAnnotations;

namespace Vicky.API.Controllers;

public record GetTransactionsPagedRequest(
    [Required]
    DateTime StartDate,
    [Required]
    DateTime EndDate,
    int PageNumber = 1,
    int PageSize = 10
) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (StartDate > EndDate)
        {
            yield return new ValidationResult(
                "StartDate must be less than or equal to EndDate.",
                [nameof(StartDate), nameof(EndDate)]
            );
        }

        if (PageNumber < 1)
        {
            yield return new ValidationResult(
                "PageNumber must be greater than or equal to 1.",
                [nameof(PageNumber)]
            );
        }

        if (PageSize < 1)
        {
            yield return new ValidationResult(
                "PageSize must be greater than or equal to 1.",
                [nameof(PageSize)]
            );
        }
    }
}