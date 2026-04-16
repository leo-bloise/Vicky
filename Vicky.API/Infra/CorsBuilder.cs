namespace Vicky.API.Infra;

internal class CorsOptions
{
    public static readonly string Name = "Cors";

    public string[] Origins { get; set; } = [];
}

internal static class CorsBuilder 
{
    public static WebApplicationBuilder ConfigureCors(this WebApplicationBuilder builder)
    {
        CorsOptions corsOptions = new();

        builder.Configuration.GetSection(CorsOptions.Name).Bind(corsOptions);

        if(corsOptions.Origins.Length == 0)
        {
            throw new ArgumentException($"CORS Bad configuration");
        }

        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.WithOrigins(corsOptions.Origins)
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });

        return builder;
    }    
}