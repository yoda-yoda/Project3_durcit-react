import React, { createContext, useContext, useEffect, useState } from "react";
import { connectWebSocketPush, disconnectWebSocket } from "../utils/webSocket";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      const memberId = localStorage.getItem("memberId");

      if (memberId) {
        const handleIncomingNotification = (message) => {
          setNotifications((prev) => [message, ...prev]);
        };

        connectWebSocketPush(handleIncomingNotification, memberId);

        return () => {
          disconnectWebSocket();
        };
      }
    }
  }, [isLoggedIn]);

  const logout = () => {
    disconnectWebSocket();
    setNotifications([]);
    setIsLoggedIn(false);
    localStorage.clear();
  };

  return (
    <WebSocketContext.Provider value={{ notifications, setNotifications, setIsLoggedIn, isLoggedIn, logout }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
