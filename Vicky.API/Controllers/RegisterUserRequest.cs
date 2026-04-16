using System.ComponentModel.DataAnnotations;

namespace Vicky.API.Controllers;

public record RegisterUserRequest(
    [Required]
    [StringLength(20, ErrorMessage = "Username must be at most 20 characters.")]
    string Username,

    [Required]
    string Password
);