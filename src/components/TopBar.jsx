import React, { useState } from "react";
import { Link } from "react-router-dom";

const TopBar = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false); // ... 드롭다운 상태
    const [isNotificationOpen, setNotificationOpen] = useState(false); // 알림 모달 상태

    const toggleNotification = () => {
        setNotificationOpen(!isNotificationOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 text-gray-600">
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
            <div className="flex items-center space-x-4">
                {/* 알림 버튼 */}
                <button
                    className="text-yellow-500 text-xl hover:text-yellow-600 focus:outline-none"
                    onClick={toggleNotification}
                >
                    🔔
                </button>
                {isNotificationOpen && (
                    <div
                        className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-64 z-50"
                    >
                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2">알림</h3>
                            <ul className="space-y-2">
                                <li>게시물에 댓글이 달렸습니다</li>
                                <li>새로운 팔로워 1명</li>
                            </ul>
                            <button
                                className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                                onClick={toggleNotification}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* 로그인 버튼 */}
                <Link
                    to="/login"
                    className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition duration-300"
                >
                    Log In
                </Link>

                {/* ... 버튼 */}
                <div className="relative">
                    <button
                        className="bg-gray-200 text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-300 transition duration-300"
                        onClick={toggleDropdown}
                    >
                        ...
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <ul className="p-2 space-y-2">
                                <li>
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                                    >
                                        <span role="img" aria-label="profile">👤</span> Profile
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                                    >
                                        <span role="img" aria-label="settings">⚙️</span> Settings
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer rounded"
                                    >
                                        <span role="img" aria-label="logout">🚪</span> Log Out
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;
