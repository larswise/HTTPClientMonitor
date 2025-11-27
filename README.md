### HTTPClientMonitor
HTTPClientMonitor is a lightweight app you can plug into your dotnet webapp for monitoring HTTP client requests and responses. 

How to use:

1. Install the NuGet package:
   ```
   Install-Package HTTPClientMonitor
   ```
2. Add the middleware to your application:
```csharp
    var builder = WebApplication.CreateBuilder(args);
    builder.UseDiagnosticApp();

    // Other configurations...
    // instead of builder.Build(), use:
    var app = builder.BuildWithHttpClientMonitor();
```
3. Open your browser and navigate to `http://localhost:yourport/diag` to view the recorded requests.