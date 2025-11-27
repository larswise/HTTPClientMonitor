using Microsoft.AspNetCore.Authorization;

namespace HttpClientMonitor.Hubs;

[AllowAnonymous]
public class Hub : Microsoft.AspNetCore.SignalR.Hub { }
