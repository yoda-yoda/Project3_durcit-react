import React from "react";
import { Link, useLocation } from "react-router-dom";

const MainFeedTopBar = () => {
  const location = useLocation();

  return (
    <div>
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
    </div>
  );
};

export default MainFeedTopBar;
