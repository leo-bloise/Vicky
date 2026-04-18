using System.ComponentModel.DataAnnotations;
using Vicky.Common;

namespace Vicky.API.Controllers;

public record GetCounterpartiesByCursorRequest(
    int? Limit,
    string? ContinuationToken,
    string? Name = null
) : IValidatableObject
{
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        List<ValidationResult> validationResults = new List<ValidationResult>();
        
        if(Limit.HasValue && Limit.Value < 5)
        {
            validationResults.Add(new ValidationResult("Limit must be, at least, 5", [nameof(Limit)]));
        }

        if(!string.IsNullOrEmpty(ContinuationToken))
        {
            try
            {
                _ = DatabaseCursorToken.FromString(ContinuationToken);    
            } catch(Exception exception)
            {
                validationResults.Add(new ValidationResult(exception.Message, [nameof(ContinuationToken)]));
            }
        }

        return validationResults;
    }
}