import React, { useState } from "react";
import { FaComments } from "react-icons/fa";
import ChatRoomList from "./ChatRoomList";
import ChatWindow from "./ChatWindow";

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  const chatRooms = [
    {
      id: 1,
      name: "유저1",
      opponentId: 101, // 상대방 ID 추가
      profileImage: "/user1.png",
      messages: [
        { sender: "me", content: "안녕하세요!" },
        { sender: "유저1", content: "어떻게 지내세요?" },
        { sender: "me", content: "오늘 날씨 좋네요." },
      ],
    },
    {
      id: 2,
      name: "유저2",
      opponentId: 102, // 상대방 ID 추가
      profileImage: "/user2.png",
      messages: [
        { sender: "유저2", content: "React 배우고 있어요!" },
        { sender: "me", content: "어려운 점이 있나요?" },
        { sender: "유저2", content: "도움이 필요하면 말해주세요." },
      ],
    },
  ];

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSelectedChat(null); // 창을 닫을 때 선택한 채팅방 초기화
    }
  };

  const selectChatRoom = (room) => {
    setSelectedChat(room); // 상대방 ID를 포함한 방 정보 저장
  };

  const handleSendMessage = (message) => {
    setSelectedChat((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [...prev.messages, { sender: "me", content: message }],
      };
    });
  };

  return (
    <div>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 bg-red-600 text-white rounded-full p-4 shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <FaComments size={24} />
      </button>

      {/* Chat Room List */}
      {isOpen && !selectedChat && (
        <ChatRoomList
          chatRooms={chatRooms}
          onSelectChatRoom={(room) => setSelectedChat(room)}
          onClose={toggleChat}
        />
      )}

      {/* Chat Window */}
      {isOpen && selectedChat && (
        <ChatWindow
          selectedChat={selectedChat}
          onSendMessage={handleSendMessage}
          onClose={toggleChat}
          onBack={() => setSelectedChat(null)} // 뒤로가기 시 채팅방 목록으로 돌아감
        />
      )}
    </div>
  );
};

export default ChatButton;
