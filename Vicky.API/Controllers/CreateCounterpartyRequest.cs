using System.ComponentModel.DataAnnotations;

namespace Vicky.API.Controllers;

public record CreateCounterpartyRequest(
    [Required]
    [MinLength(3)]
    string Name
);