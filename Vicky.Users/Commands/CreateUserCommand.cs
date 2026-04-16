namespace Vicky.Users.Commands;

public record CreateUserCommand(
    string Username,
    string Password
);