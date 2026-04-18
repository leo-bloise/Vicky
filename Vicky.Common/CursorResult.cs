namespace Vicky.Common;

public record CursorResult<T>(
    IEnumerable<T> Data,
    DatabaseCursorToken? ContinuationToken
);