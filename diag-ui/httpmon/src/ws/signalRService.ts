
// src/signalrService.js
import * as signalR from '@microsoft/signalr';

let connection: signalR.HubConnection;

export function createConnection() {
  connection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5833/httpClientMonitorHub')
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Trace)
    .build();

  return connection;
}

export function getConnection() {
  return connection;
}
