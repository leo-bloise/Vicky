using System.ComponentModel.DataAnnotations;

namespace Vicky.API.Controllers;

public record MonthReportRequest(
    [Required]
    [Range(0, 12)]
    int Month,
    [Required]
    int Year
) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if(Year <= 0)
        {
            yield return new ValidationResult("Year must be bigger than 0");
        }
    }
}