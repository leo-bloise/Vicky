namespace Vicky.Users.Commands;

public record LoginUserCommand(
    string Username,
    string Password
);