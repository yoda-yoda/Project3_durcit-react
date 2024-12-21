import React, { createContext, useContext, useEffect, useState } from "react";
import { connectWebSocketPush, disconnectWebSocket } from "../utils/webSocket";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const memberId = localStorage.getItem("memberId");

    if (memberId) {
      const handleIncomingNotification = (message) => {
        setNotifications((prev) => [message, ...prev]);
      };

      connectWebSocketPush(handleIncomingNotification, memberId);

      setIsConnected(true);

      return () => {
        disconnectWebSocket();
        setIsConnected(false);
      };
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ isConnected, notifications }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
