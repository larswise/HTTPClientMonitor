using HttpClientMonitor.SignalR;
using System.Diagnostics;

namespace HttpClientMonitor;

public static class GlobalHttpClientMonitor
{
    public static void Register(Broadcaster broadcaster)
    {
        DiagnosticListener.AllListeners.Subscribe(new HttpDiagnosticListenerObserver(broadcaster));
    }

    private class HttpDiagnosticListenerObserver : IObserver<DiagnosticListener>
    {
        private readonly Broadcaster _broadcaster;
        public HttpDiagnosticListenerObserver(Broadcaster broadcaster)
        {
            _broadcaster = broadcaster;
        }
        public void OnCompleted() { }
        public void OnError(Exception error) { }

        public void OnNext(DiagnosticListener listener)
        {
            // We only care about the HttpClient DiagnosticSource
            if (listener.Name == "HttpHandlerDiagnosticListener")
            {
                listener.Subscribe(new HttpEventObserver(_broadcaster));
            }
        }
    }

    private class HttpEventObserver : IObserver<KeyValuePair<string, object>>
    {
        private readonly Broadcaster _broadcaster;
        public HttpEventObserver(Broadcaster broadcaster)
        {
            _broadcaster = broadcaster;
        }
        public void OnCompleted() { }
        public void OnError(Exception error) { }

        public void OnNext(KeyValuePair<string, object> kvp)
        {
            switch (kvp.Key)
            {
                case "System.Net.Http.HttpRequestOut.Start":
                    var request = GetProperty<HttpRequestMessage>(kvp.Value, "Request");
                    var requestActivity = Activity.Current;
                    var requestData = HttpRequestData.Create(request, requestActivity);
                    
                    Console.WriteLine($"🚀 OUTGOING REQUEST: {request?.Method} {request?.RequestUri}");
                    Console.WriteLine($"   TraceId: {requestActivity?.TraceId} (shared across all calls in same request)");
                    Console.WriteLine($"   SpanId: {requestData.CorrelationId} (unique per HTTP call)");
                    
                    _broadcaster.BroadcastAsync(requestData).Wait();
                    break;

                case "System.Net.Http.HttpRequestOut.Stop":
                    var response = GetProperty<HttpResponseMessage>(kvp.Value, "Response");
                    var responseActivity = Activity.Current;
                    var responseData = HttpResponseData.Create(response, responseActivity, true);
                    
                    Console.WriteLine($"✅ OUTGOING RESPONSE: {responseData.StatusCode} {response?.RequestMessage?.RequestUri}");
                    Console.WriteLine($"   SpanId: {responseData.CorrelationId} (pairs with request having same SpanId)");
                    
                    _broadcaster.BroadcastAsync(responseData).Wait();
                    break;
            }
        }

        private static T? GetProperty<T>(object obj, string propertyName)
        {
            return (T?)obj.GetType().GetProperty(propertyName)?.GetValue(obj);
        }
    }
}
