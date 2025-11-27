import { useEffect, useState } from 'react';
import { createConnection } from '../ws/signalRService';
import * as signalR from '@microsoft/signalr';
import type { HttpRequestData } from '@/models/models';

export function useSignalR(ran: string) {
  const [connection, setConnection] = useState<signalR.HubConnection>();
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const conn = createConnection();
    console.log("Effect running")

    conn.on('ReceiveDebugMessage', (message: HttpRequestData) => {
      console.log("uupdating messages!", message);
      setMessages(prev => [...prev, message]);
    });
    console.log("Setting up connection handlers");
    conn.onclose(err => {
      console.warn('SignalR: connection closed', err);
    });
    conn.onreconnecting(err => {
      console.info('SignalR: reconnecting', err);
    });
    conn.onreconnected(id => {
      console.info('SignalR: reconnected, connection id:', id);
    });

    conn.start()
      .then(() => console.log('Connected to SignalR'))
      .catch(err => console.error('SignalR Connection Error: ', err));
    setConnection(conn);
    console.log("Effect run")
    return () => {
      console.log("Cleaning up connection");
      conn.stop();
    };
  
  }, [ran]);

  return { connection, messages };
}
