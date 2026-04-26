using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Vicky.Common;
using Vicky.Users.Services;

namespace Vicky.API.Infra.Filters;

public class ValidateCsrfTokenFilter(
    IAntiforgery antiforgery,
    IVickyLoggerFactory vickyLoggerFactory
) : IAsyncActionFilter
{
    private readonly IVickyLogger<ValidateCsrfTokenFilter> _logger = vickyLoggerFactory.CreateLogger<ValidateCsrfTokenFilter>();

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        try
        {
            string[] ignorableMethods = [
                "GET",
                "OPTIONS",
                "HEAD"
            ];

            bool ignored = context.ActionDescriptor.EndpointMetadata.OfType<IgnoreCsrfTokenAttribute>().Any();

            if(ignorableMethods.Contains(context.HttpContext.Request.Method) || ignored)
            {
                _logger.LogInformation($"{context.HttpContext.Request.Path} not checked for CSRF token");
                await next();    
                return;
            }

            foreach(var cookie in context.HttpContext.Request.Cookies)
            {
                _logger.LogInformation($"{cookie.Key}={cookie.Value}");
            }

            await antiforgery.ValidateRequestAsync(context.HttpContext);
        } catch(AntiforgeryValidationException excption)
        {
            Console.WriteLine(excption);
            context.Result = new ForbidResult();
            return;
        }

        await next();
    }
}