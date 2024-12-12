import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="w-64 h-screen bg-gray-100 fixed top-30 left-0 shadow-md">
      <nav className="flex flex-col py-6 px-4">
        <Link to="/" className="mb-4 text-lg font-semibold text-gray-700 hover:text-blue-500">
          Home
        </Link>
        <Link to="/profile" className="mb-4 text-lg font-semibold text-gray-700 hover:text-blue-500">
          Profile
        </Link>
        <Link to="/create-post" className="mb-4 text-lg font-semibold text-gray-700 hover:text-blue-500">
          Create Post
        </Link>
        <Link to="/notifications" className="mb-4 text-lg font-semibold text-gray-700 hover:text-blue-500">
          Notifications
        </Link>
      </nav>
    </div>
  );
};

export default SideBar;
