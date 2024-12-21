import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Login from "../pages/Login";
import axios from "axios";
import NotificationModal from "./NotificationModal";
import { useWebSocket } from "../context/WebSocketContext";
import {disconnectWebSocket} from "../utils/webSocket";

const TopBar = () => {
    const [isNotificationOpen, setNotificationOpen] = useState(false); // 알림 모달 상태
    const [isMessageOpen, setMessageOpen] = useState(false); // 메시지 모달 상태
    const [isDropdownOpen, setDropdownOpen] = useState(false); // 드롭다운 상태
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { notifications, setNotifications } = useWebSocket();
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // 확인되지 않은 알림의 개수 계산
        const count = notifications.filter(notification => !notification.confirmed).length;
        setUnreadCount(count);
    }, [notifications]);

    const updateLoginState = () => {
        const token = localStorage.getItem("accessToken");
        setIsLoggedIn(!!token); // 토큰이 존재하면 로그인 상태로 설정
    };

    useEffect(() => {
        updateLoginState();

        const handleStorageChange = () => {
            updateLoginState();
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            return () => {
                disconnectWebSocket();
            };
        }
    }, [isLoggedIn]);

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            const memberId = localStorage.getItem("memberId");

            // Send logout request to backend
            if (refreshToken) {
                await axios.post("http://localhost:8080/auth/logout", {
                    refreshToken,
                    memberId,
                });

                // Clear tokens from localStorage
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("memberId");

                // 상태 업데이트 및 새로고침
                updateLoginState();
                navigate("/");
            }
        } catch (error) {
            console.error("Logout failed:", error);

            // Clear tokens even if logout fails
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            updateLoginState();
            navigate("/");
        }
    };

    const toggleNotification = () => {
        setNotificationOpen(!isNotificationOpen);
        setMessageOpen(false); // 메시지 창 닫기
        setDropdownOpen(false); // 드롭다운 창 닫기
    };

    const toggleMessage = () => {
        setMessageOpen(!isMessageOpen);
        setNotificationOpen(false); // 알림 창 닫기
        setDropdownOpen(false); // 드롭다운 창 닫기
    };

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
        setNotificationOpen(false); // 알림 창 닫기
        setMessageOpen(false); // 메시지 창 닫기
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
                setNotifications={setNotifications}
                onClose={toggleNotification}
              />

              {/* 로그인 버튼 */}
              <div>
                  {isLoggedIn ? (
                    // Logout button
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-700 transition duration-300"
                    >
                        Logout
                    </button>
                  ) : (
                    // Login button
                    <button
                      onClick={() => setLoginOpen(true)}
                      className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-700 transition duration-300"
                    >
                        Login
                    </button>
                  )}
              </div>

              {/* Login Modal */}
              <Login isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />

              {/*/!* ... 버튼 *!/*/}
              {/*<div className="relative">*/}
              {/*    <button*/}
              {/*      className="bg-gray-200 text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-300 transition duration-300"*/}
              {/*      onClick={toggleDropdown}*/}
              {/*    >*/}
              {/*        ...*/}
              {/*    </button>*/}
              {/*    {isDropdownOpen && (*/}
              {/*      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">*/}
              {/*          <ul className="p-2 space-y-2">*/}
              {/*              <li>*/}
              {/*                  <Link*/}
              {/*                    to="/profile"*/}
              {/*                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"*/}
              {/*                  >*/}
              {/*                      <span role="img" aria-label="profile">👤</span> Profile*/}
              {/*                  </Link>*/}
              {/*              </li>*/}
              {/*              <li>*/}
              {/*                  <a*/}
              {/*                    href="#"*/}
              {/*                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"*/}
              {/*                  >*/}
              {/*                      <span role="img" aria-label="settings">⚙️</span> Settings*/}
              {/*                  </a>*/}
              {/*              </li>*/}
              {/*              <li>*/}
              {/*                  <a*/}
              {/*                    href="#"*/}
              {/*                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"*/}
              {/*                  >*/}
              {/*                      <span role="img" aria-label="logout">🚪</span> Log Out*/}
              {/*                  </a>*/}
              {/*              </li>*/}
              {/*          </ul>*/}
              {/*      </div>*/}
              {/*    )}*/}
              {/*</div>*/}
          </div>
      </div>
    );
};

export default TopBar;
