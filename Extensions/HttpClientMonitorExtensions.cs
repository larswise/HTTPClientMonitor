using HttpClientMonitor.Hubs;
using HttpClientMonitor.SignalR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using System.Collections.Concurrent;

namespace HttpClientMonitor.Extensions;

public static class HttpClientMonitorExtensions
{
    private static readonly ConcurrentBag<Action<WebApplication>> _deferred = new();

    public static WebApplicationBuilder UseDiagnosticApp(
        this WebApplicationBuilder builder,
        string path = "/diag"
    )
    {

        builder.Services.AddSignalR();
        builder.Services.AddSingleton<Broadcaster>();

        _deferred.Add(app =>
        {
            var env = app.Environment;
            var diagPath = Path.Combine(AppContext.BaseDirectory, "diag-ui", "httpmon", "dist");

            app.Map("/diag", diagApp =>
            {
                // Serve index.html by default
                diagApp.UseDefaultFiles(new DefaultFilesOptions
                {
                    FileProvider = new PhysicalFileProvider(diagPath),
                    DefaultFileNames = new List<string> { "index.html" }
                });

                // Serve static files from the dist folder (JS/CSS/assets)
                diagApp.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(diagPath)
                });

                // Fallback for SPA routing
                diagApp.Run(async context =>
                {
                    context.Response.ContentType = "text/html";
                    await context.Response.SendFileAsync(Path.Combine(diagPath, "index.html"));
                });
            });
            app.MapHub<Hub>("/httpClientMonitorHub");
            var instance = app.Services.GetRequiredService<Broadcaster>();
            GlobalHttpClientMonitor.Register(instance);
        });

        return builder;
    }

    public static WebApplication BuildWithHttpClientMonitor(this WebApplicationBuilder builder)
    {
        var app = builder.Build();
        foreach (var a in _deferred)
            a(app);
        return app;
    }
}
