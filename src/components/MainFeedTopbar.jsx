import React from "react";
import { Link, useLocation } from "react-router-dom";

const MainFeedTopBar = () => {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("memberId"); // 로그인 상태 확인

  return (
    <div>
      {/* Posts 탭은 항상 표시 */}
      <Link
        to="/posts"
        className={`px-4 py-2 rounded-full ${
          location.pathname === "/posts" || location.pathname === "/"
            ? "bg-gray-300"
            : "bg-white text-gray-600 hover:bg-gray-100"
        }`}
      >
        Posts
      </Link>
      {/* Tags 탭은 로그인된 경우에만 표시 */}
      {isLoggedIn && (
        <Link
          to="/tags"
          className={`ml-4 px-4 py-2 rounded-full ${
            location.pathname === "/tags"
              ? "bg-gray-300"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          Tags
        </Link>
      )}
    </div>
  );
};

export default MainFeedTopBar;
