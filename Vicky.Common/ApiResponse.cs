namespace Vicky.Common;

public record ProblemDetails(
    string Type,
    string Title,
    string? Detail = null,
    int? Status = null,
    string? Instance = null,
    Dictionary<string, object?>? Extensions = null
);

public record ApiResponse<T>(
    bool Success,
    string? Message,
    T? Data
)
{
    public static ApiResponse<T> SuccessResponse(T data, string? message = null)
        => new ApiResponse<T>(true, message, data);
    
    public static ApiResponse<T> FailedResponse(T data, string? message = null) => new ApiResponse<T>(false, message, data);
}