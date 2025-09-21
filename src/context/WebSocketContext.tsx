import React, { createContext, useContext } from "react";
import { useProductEvents } from "../hooks/useWebSocket";

interface WebSocketContextType {
  isConnected: boolean;
  connectionError: string | null;
  products: any[];
  notifications: any[];
  clearNotifications: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider");
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const token = localStorage.getItem("jwt-token");
  
  const {
    isConnected,
    connectionError,
    products,
    notifications,
    clearNotifications,
  } = useProductEvents(token || undefined);

  const value: WebSocketContextType = {
    isConnected,
    connectionError,
    products,
    notifications,
    clearNotifications,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}
