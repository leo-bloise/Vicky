using System.ComponentModel.DataAnnotations;

namespace Vicky.API.Controllers;

public record GetCounterpartiesRequest(
    [Required]
    [Range(1, int.MaxValue)]
    int? PageNumber,
    [Required]
    [Range(1, int.MaxValue)]
    int? PageSize,
    [Required]
    DateTime? StartDate,
    [Required]
    DateTime? EndDate
) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (StartDate.HasValue && EndDate.HasValue && StartDate > EndDate)
        {
            yield return new ValidationResult(
                "StartDate must be less than or equal to EndDate.",
                [nameof(StartDate), nameof(EndDate)]
            );
        }
    }
}