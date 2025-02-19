import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

export const WS_URL = 'ws://192.168.137.21:81/ws';
const RECONNECT_INTERVAL = 3000;

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: (message: string) => void;
  connect: () => void;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);  
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const shouldReconnect = useRef(false);

  const cleanup = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
  };

  const connect = useCallback(() => {
    cleanup();
    shouldReconnect.current = true;
    
    try {
      console.log('Attempting to connect to:', WS_URL);
      
      // Add connection options
      ws.current = new WebSocket(WS_URL);
      
      // Add connection timeout
      const connectionTimeout = setTimeout(() => {
        if (ws.current?.readyState !== WebSocket.OPEN) {
          console.log('Connection timeout - closing socket');
          ws.current?.close();
        }
      }, 5000);

      ws.current.onopen = () => {
        console.log('WebSocket connected successfully');
        clearTimeout(connectionTimeout);
        setIsConnected(true);
      };

      ws.current.onclose = (event) => {
        console.log('WebSocket closed with code:', event.code, 'reason:', event.reason);
        console.log('Socket state:', ws.current?.readyState);
        setIsConnected(false);
        
        if (shouldReconnect.current) {
          console.log('Attempting to reconnect...');
          reconnectTimeout.current = setTimeout(connect, RECONNECT_INTERVAL);
        }
      };

      ws.current.onerror = (error: any) => {
        console.error('WebSocket connection details:', {
          isTrusted: error.isTrusted,
          message: error.message,
          type: error.type,
          url: WS_URL,
          readyState: ws.current?.readyState,
          protocol: ws.current?.protocol,
        });
      };

    } catch (error) {
      console.error('Connection error:', error);
      if (shouldReconnect.current) {
        reconnectTimeout.current = setTimeout(connect, RECONNECT_INTERVAL);
      }
    }
  }, []);

  const disconnect = useCallback(() => {
    shouldReconnect.current = false;
    cleanup();
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ isConnected, sendMessage, connect, disconnect }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};