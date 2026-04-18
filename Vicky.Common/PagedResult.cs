namespace Vicky.Common;

public record PagedResult<T>(
    int CurrentPage,
    int TotalPages,
    int TotalItems,
    IEnumerable<T> Data
);
