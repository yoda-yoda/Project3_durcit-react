import React from "react";

const TabMenu = ({ activeTab, onTabChange }) => {
  return (
    <div className="mt-6 border-b">
      <ul className="flex space-x-6 text-gray-600 font-medium">
        <li
          onClick={() => onTabChange("overview")}
          className={`cursor-pointer pb-2 text-lg ${
            activeTab === "overview" ? "border-b-2 border-blue-500 text-blue-500" : "hover:text-blue-500"
          }`}
        >
          Overview
        </li>
        <li
          onClick={() => onTabChange("posts")}
          className={`cursor-pointer pb-2 text-lg ${
            activeTab === "posts" ? "border-b-2 border-blue-500 text-blue-500" : "hover:text-blue-500"
          }`}
        >
          Posts
        </li>
        <li
          onClick={() => onTabChange("comments")}
          className={`cursor-pointer pb-2 text-lg ${
            activeTab === "comments" ? "border-b-2 border-blue-500 text-blue-500" : "hover:text-blue-500"
          }`}
        >
          Comments
        </li>
        <li
          onClick={() => onTabChange("followers")}
          className={`cursor-pointer pb-2 text-lg ${
            activeTab === "followers" ? "border-b-2 border-blue-500 text-blue-500" : "hover:text-blue-500"
          }`}
        >
          Followers
        </li>
        <li
          onClick={() => onTabChange("following")}
          className={`cursor-pointer pb-2 text-lg ${
            activeTab === "following" ? "border-b-2 border-blue-500 text-blue-500" : "hover:text-blue-500"
          }`}
        >
          Following
        </li>
      </ul>
    </div>
  );
};

export default TabMenu;
