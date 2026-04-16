using Microsoft.AspNetCore.Mvc;

namespace Vicky.API.Infra;

public static class ValidationErrorResponseExtensions
{
    public static WebApplicationBuilder ConfigureValidationErrorResponse(this WebApplicationBuilder builder)
    {
        builder.Services
            .AddControllers(options =>
            {
                options.Filters.Add<DomainExceptionFilter>();
            })
            .ConfigureApiBehaviorOptions(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    var errors = context.ModelState
                        .Where(x => x.Value?.Errors.Count > 0)
                        .ToDictionary(
                            x => x.Key,
                            x => x.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
                        );

                    var response = new ProblemDetails
                    {
                        Type = "https://tools.ietf.org/html/rfc9110#section-15.5.1",
                        Title = "One or more validation errors occurred.",
                        Status = StatusCodes.Status422UnprocessableEntity,
                        Extensions = new Dictionary<string, object?>
                        {
                            { "errors", errors }
                        }
                    };

                    return new ObjectResult(response)
                    {
                        StatusCode = StatusCodes.Status422UnprocessableEntity
                    };
                };
            });

        return builder;
    }
}
