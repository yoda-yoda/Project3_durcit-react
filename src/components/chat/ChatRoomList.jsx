import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import apiClient from "../../utils/apiClient";

const ChatRoomList = ({ onSelectChatRoom, onClose }) => {
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const loadChatRooms = async () => {
      try {
        const memberId = localStorage.getItem("memberId"); // 로컬스토리지에서 사용자 ID 가져오기
        if (!memberId) {
          console.error("로그인 정보가 없습니다.");
          return;
        }

        const response = await apiClient.get("/rooms", {
          params: {
            memberId: Number(memberId),
          },
        });

        const rooms = response.data.data; // 응답 데이터에서 'data'를 가져옴
        setChatRooms(rooms);
      } catch (error) {
        console.error("채팅방 목록 불러오기 실패:", error);
      }
    };

    loadChatRooms();
  }, []);

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
        {chatRooms.length > 0 ? (
          chatRooms.map((room) => (
            <div
              key={room.roomId}
              onClick={() => onSelectChatRoom(room)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer mb-2"
            >
              <p className="font-semibold text-gray-800">#{room.roomId}</p>
              <p className="text-sm text-gray-500">
                대화 상대: {room.targetNickname}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">채팅방이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ChatRoomList;
