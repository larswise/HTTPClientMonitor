using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;
using Hub = HttpClientMonitor.Hubs.Hub;

namespace HttpClientMonitor.SignalR;

public class HttpRequestData
{
    public string Method { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Authority { get; set; } = string.Empty;
    public string? ContentType { get; set; }
    public long? ContentLength { get; set; }
    public string Version { get; set; }
    public DateTime RequestedAt { get; set; }
    public Dictionary<string, string> Headers { get; set; } = new();
    public string? CorrelationId { get; set; }

    public static HttpRequestData Create(HttpRequestMessage? request, Activity? activity = null)
    {
        var currentActivity = activity ?? Activity.Current;

        return new HttpRequestData
        {
            Method = request?.Method.Method ?? string.Empty,
            Url = request?.RequestUri?.ToString() ?? string.Empty,
            Authority = request?.RequestUri?.Authority ?? string.Empty,
            ContentType = request?.Content?.Headers.ContentType?.ToString(),
            ContentLength = request?.Content?.Headers.ContentLength,
            Version = $"{request?.Version.Major}.{request?.Version.Minor}",
            RequestedAt = DateTime.UtcNow,
            Headers = request?.Headers.ToDictionary(h => h.Key, h => string.Join(", ", h.Value)) ?? new Dictionary<string, string>(),
            CorrelationId = currentActivity?.SpanId.ToString()
        };
    }
}

public class HttpResponseData
{
    public int StatusCode { get; set; }
    public string ReasonPhrase { get; set; } = string.Empty;
    public DateTime RespondedAt { get; set; }
    public string? ContentType { get; set; }
    public long? ContentLength { get; set; }
    public string Version { get; set; }
    // Only include response-specific headers if needed (optional)
    public Dictionary<string, string>? ResponseHeaders { get; set; }

    // Use SpanId for unique correlation per HTTP call (not TraceId which is shared)
    public string? CorrelationId { get; set; }

    public static HttpResponseData Create(HttpResponseMessage? response, Activity? activity = null, bool includeHeaders = false)
    {
        // Use the provided activity or fall back to Activity.Current
        var currentActivity = activity ?? Activity.Current;

        return new HttpResponseData
        {
            StatusCode = (int)(response?.StatusCode ?? 0),
            ReasonPhrase = response?.ReasonPhrase ?? string.Empty,
            RespondedAt = DateTime.UtcNow,
            ContentType = response?.Content?.Headers.ContentType?.ToString(),
            ContentLength = response?.Content?.Headers.ContentLength,
            Version = $"{response?.Version.Major}.{response?.Version.Minor}",

            // Only include headers if explicitly requested
            ResponseHeaders = includeHeaders
                ? response?.Headers.ToDictionary(h => h.Key, h => string.Join(", ", h.Value))
                : null,

            // Use SpanId instead of TraceId - this matches the unique request SpanId
            CorrelationId = currentActivity?.SpanId.ToString()
        };
    }
}

public class Broadcaster
{
    private readonly IHubContext<Hub> _hubContext;

    public Broadcaster(IHubContext<Hub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task BroadcastAsync(HttpRequestData message)
    {
        await _hubContext.Clients.All.SendAsync("ReceiveDebugRequest", message);
    }

    public async Task BroadcastAsync(HttpResponseData message)
    {
        await _hubContext.Clients.All.SendAsync("ReceiveDebugResponse", message);
    }
}
