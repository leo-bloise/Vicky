using System.Text;

namespace Vicky.Common;

public record DatabaseCursorToken(string Field, string Value)
{
    public override string ToString()
    {
        var raw = $"{Field}:{Value}";
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(raw));
    }

    public static DatabaseCursorToken FromString(string token)
    {
        string raw = Encoding.UTF8.GetString(Convert.FromBase64String(token));
        string[] parts = raw.Split(':', 2);

        bool isValidToken = parts.Length == 2 && !(string.IsNullOrEmpty(parts.First()) || string.IsNullOrWhiteSpace(parts.First()));

        if(!isValidToken) throw new ArgumentException(nameof(token), "Invalid continuation token");

        return new DatabaseCursorToken(parts[0], parts[1]);
    }
};