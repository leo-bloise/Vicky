using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Vicky.Common.Exceptions;

namespace Vicky.API.Infra;

public class DomainExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        if (context.Exception is not DomainException domainException)
        {
            return;
        }

        var details = domainException.ToProblemDetails();

        var infraDetails = new ProblemDetails()
        {
            Type = details.Type,
            Title = details.Title,
            Detail = details.Detail,
            Extensions = details.Extensions ?? [],
            Instance = details.Instance,
            Status = details.Status
        };

        context.Result = new ObjectResult(infraDetails)
        {
            StatusCode = infraDetails.Status ?? 500
        };

        context.ExceptionHandled = true;
    }
}