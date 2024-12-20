import React from "react";

const NotificationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-16 top-12 bg-white border border-gray-200 rounded-lg shadow-lg w-64 z-50">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">알림</h3>
        <ul className="space-y-2">
          <li>게시물에 댓글이 달렸습니다</li>
          <li>새로운 팔로워 1명</li>
        </ul>
        <button
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
