namespace Vicky.API.Infra.Services;

public class JwtOptions
{
    public static readonly string Name = "Jwt";
    public string Key { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int ExpirationHours { get; set; }
}
