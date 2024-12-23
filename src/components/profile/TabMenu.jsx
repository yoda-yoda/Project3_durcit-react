import React from "react";

const TabMenu = ({ activeTab, onTabChange }) => {
  return (
    <div className="mt-6 border-b">
      <ul className="flex space-x-6 text-gray-600 font-medium">
        <li
          onClick={() => onTabChange("overview")}
          className={`cursor-pointer pb-2 text-lg ${
            activeTab === "overview" ? "border-b-2 border-red-500 text-red-600" : "hover:text-red-600"
          }`}
        >
          Overview
        </li>
        <li
          onClick={() => onTabChange("posts")}
          className={`cursor-pointer pb-2 text-lg ${
            activeTab === "posts" ? "border-b-2 border-red-500 text-red-600" : "hover:text-red-600"
          }`}
        >
          Posts
        </li>
        <li
          onClick={() => onTabChange("comments")}
          className={`cursor-pointer pb-2 text-lg ${
            activeTab === "comments" ? "border-b-2 border-red-500 text-red-600" : "hover:text-red-600"
          }`}
        >
          Comments
        </li>
        <li
          onClick={() => onTabChange("followers")}
          className={`cursor-pointer pb-2 text-lg ${
            activeTab === "followers" ? "border-b-2 border-red-600 text-red-600" : "hover:text-red-600"
          }`}
        >
          Followers
        </li>
        <li
          onClick={() => onTabChange("following")}
          className={`cursor-pointer pb-2 text-lg ${
            activeTab === "following" ? "border-b-2 border-red-600 text-red-600" : "hover:text-red-600"
          }`}
        >
          Following
        </li>
        <li
          onClick={() => onTabChange("tagFollowing")}
          className={`cursor-pointer pb-2 text-lg ${
            activeTab === "tagFollowing" ? "border-b-2 border-red-600 text-red-600" : "hover:text-red-600"
          }`}
        >
          TagFollowing
        </li>
      </ul>
    </div>
  );
};

export default TabMenu;
