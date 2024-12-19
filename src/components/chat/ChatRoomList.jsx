import React from "react";
import { FaTimes } from "react-icons/fa";

const ChatRoomList = ({ chatRooms, onSelectChatRoom, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-red-600 text-white p-2 rounded-t-lg">
        <h3 className="text-lg font-semibold">채팅방 목록</h3>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 focus:outline-none"
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Chat Room List */}
      <div className="p-4 flex-1 overflow-y-auto">
        {chatRooms.map((room) => (
          <div
            key={room.id}
            onClick={() => onSelectChatRoom(room)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer mb-2"
          >
            {room.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatRoomList;
