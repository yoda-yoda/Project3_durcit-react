import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline"; // Heroicons import

const Sidebar = () => {
  const location = useLocation();
  const memberId = localStorage.getItem("memberId"); // 로컬스토리지에서 멤버 ID 가져오기

  const menuItems = [
    { name: "Home", path: "/", icon: <HomeIcon className="w-6 h-6" /> },
    ...(memberId
      ? [
        { name: "Profile", path: "/profile", icon: <UserIcon className="w-6 h-6" /> },
        { name: "Create Post", path: "/create-post", icon: <PencilSquareIcon className="w-6 h-6" /> },
        {
          name: "My Feed",
          path: `/users/${memberId}`, // 멤버 ID를 경로에 포함
          icon: <UserIcon className="w-6 h-6" />,
        },
      ]
      : []),
  ];

  return (
    <div className="h-screen w-64 bg-gray-100 text-gray-700 p-4 space-y-6 fixed top-16">
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-200 ${
                location.pathname === item.path
                  ? "bg-gray-300 font-semibold text-gray-900"
                  : ""
              }`}
            >
              <span>{item.icon}</span>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
