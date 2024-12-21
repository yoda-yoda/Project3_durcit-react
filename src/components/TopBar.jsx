import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Login from "../pages/Login";
import axios from "axios";
import NotificationModal from "./NotificationModal";
import { useWebSocket } from "../context/WebSocketContext";
import apiClient from "../utils/apiClient";

const TopBar = () => {
    const [isNotificationOpen, setNotificationOpen] = useState(false); // 알림 모달 상태
    const [isLoginOpen, setLoginOpen] = useState(false);
    const { notifications, setNotifications, setIsLoggedIn, isLoggedIn, logout } = useWebSocket();
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);

    // 알림 데이터를 가져오는 로직
    const fetchNotifications = async () => {
        const memberId = localStorage.getItem("memberId");
        if (!memberId) return;

        try {
            const response = await apiClient.get("/pushs", {
                params: { memberId },
            });
            setNotifications(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchNotifications();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        const count = notifications.filter((notification) => !notification.confirmed).length;
        setUnreadCount(count);
    }, [notifications]);

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            const memberId = localStorage.getItem("memberId");

            if (refreshToken) {
                await axios.post("http://localhost:8080/auth/logout", {
                    refreshToken,
                    memberId,
                });

                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("memberId");

                logout();
                navigate("/");
            }
        } catch (error) {
            console.error("Logout failed:", error);
            localStorage.clear();
            navigate("/");
        }
    };

    const toggleNotification = () => {
        fetchNotifications();
        setNotificationOpen(!isNotificationOpen);
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.confirmed) {
            try {
                await apiClient().put(`/pushs/${notification.id}/confirm`);
                setNotifications((prev) =>
                  prev.map((notif) =>
                    notif.id === notification.id
                      ? { ...notif, confirmed: true }
                      : notif
                  )
                );
            } catch (error) {
                console.error("Failed to confirm notification:", error);
            }
        }

        if (notification.postId) {
            navigate(`/posts/${notification.postId}`);
        }
    };

    return (
      <div className="w-full flex justify-between items-center px-6 py-4 bg-gray-50 text-gray-600 fixed top-0 left-0 z-10 h-16 shadow">
          {/* 로고 섹션 */}
          <Link to="/" className="text-2xl font-bold">
              <img src="/durcit-header-logo.png" alt="Durcit Logo" className="w-28 h-auto" />
          </Link>

          {/* 검색바 섹션 */}
          <div className="flex-1 mx-6">
              <input
                type="text"
                placeholder="Search Durcit"
                className="w-full px-4 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-500"
              />
          </div>

          {/* 버튼 섹션 */}
          <div className="flex items-center space-x-4 relative">
              {/* 알림 버튼 */}
              <button
                className="text-yellow-500 text-xl hover:text-yellow-600 focus:outline-none"
                onClick={toggleNotification}
              >
                  🔔
              </button>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                </span>
              )}
              <NotificationModal
                isOpen={isNotificationOpen}
                notifications={notifications}
                onClose={toggleNotification}
                onNotificationClick={handleNotificationClick}
              />

              {/* 로그인 버튼 */}
              <div>
                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-700 transition duration-300"
                    >
                        Logout
                    </button>
                  ) : (
                    <button
                      onClick={() => setLoginOpen(true)}
                      className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-700 transition duration-300"
                    >
                        Login
                    </button>
                  )}
              </div>

              <Login isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
          </div>
      </div>
    );
};

export default TopBar;
