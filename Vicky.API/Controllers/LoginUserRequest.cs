using System.ComponentModel.DataAnnotations;

namespace Vicky.API.Controllers;

public record LoginUserRequest(
    [Required]
    string Username,
    [Required]
    string Password
);