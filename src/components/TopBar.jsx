import React from "react";
import { Link } from "react-router-dom";

const TopBar = () => {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-50 text-gray-600">
      <Link to="/" className="text-2xl font-bold">
        <img src="/durcit-header-logo.png" alt="" className="w-28 h-auto" />
      </Link>
      <div>
        <Link to="/login" className="ml-4 text-lg hover:text-blue-400">
          Login
        </Link>
        <Link to="/profile" className="ml-4 text-lg hover:text-blue-400">
          Profile
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
