import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";

const NotificationModal = ({ isOpen, notifications, setNotifications, onClose, fetchNotifications }) => {
  const [hasFetched, setHasFetched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && !hasFetched) {
      fetchNotifications();
      setHasFetched(true);
    }
  }, [isOpen, hasFetched, fetchNotifications]);

  if (!isOpen) return null;

  const handleNotificationClick = async (postId, confirmed, pushId) => {
    if (!confirmed) {
      try {
        await apiClient.put(`/pushs/${pushId}/confirm`);
        console.log(`Push with ID ${pushId} confirmed.`);

        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === pushId
              ? { ...notification, confirmed: true }
              : notification
          )
        );

      } catch (error) {
        console.error(`Failed to confirm push with ID ${pushId}:`, error);
      }
    }
    if (postId) {
      navigate(`/posts/${postId}`); // postId로 이동
    }
  }

  return (
    <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg w-96 z-50">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">알림</h3>
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <li
                key={index}
                onClick={() => handleNotificationClick(notification.postId, notification.confirmed, notification.id)}
                className={`p-2 border-b last:border-b-0 cursor-pointer rounded ${
                  !notification.confirmed
                    ? "hover:bg-gray-100"
                    : "bg-gray-200 text-gray-400" // 연한 색상
                }`}
              >
                {notification.message}
              </li>
            ))
          ) : (
            <li className="text-gray-500">알림이 없습니다.</li>
          )}
        </ul>
        <button
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
