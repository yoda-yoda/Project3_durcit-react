import React, { useState, useEffect } from "react";
import { FaTimes, FaArrowLeft } from "react-icons/fa";
import { sendMessage, connectWebSocket, disconnectWebSocket } from "../../utils/webSocket";
import apiClient from "../../utils/apiClient";

const ChatWindow = ({ selectedChat, onClose, onBack }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const memberId = localStorage.getItem("memberId");
    console.log(selectedChat)

    // 기존 메시지 가져오기
    const fetchMessages = async () => {
      try {
        const response = await apiClient.get(`/rooms/${selectedChat.roomId}/messages`);
        setMessages(response.data.data); // API에서 받은 메시지 설정
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    // WebSocket 연결 설정
    const handleIncomingMessage = (data) => {
      if (data.roomId === selectedChat.roomId) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    fetchMessages();
    connectWebSocket(handleIncomingMessage, memberId);

    return () => {
      disconnectWebSocket();
    };
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const memberId = localStorage.getItem("memberId");
    const targetNickname = selectedChat.memberId == localStorage.getItem("memberId") ? selectedChat.targetNickname : selectedChat.nickname;
    console.log(selectedChat.roomId, selectedChat.roomId);

    sendMessage(selectedChat.roomId, memberId, targetNickname, message);

    setMessages((prevMessages) => [
      ...prevMessages,
      { senderId: Number(memberId), opponentId: targetNickname, content: message, createdAt: new Date().toISOString() },
    ]);
    setMessage("");
  };

  const getNickname = (room, currentUserId) => {
    return room.memberId != currentUserId
      ? room.nickname
      : room.targetNickname;
  };

  const getProfile = (room, currentUserId) => {
    return room.memberId != currentUserId
      ? room.memberProfile
      : room.targetProfile;
  }


  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-red-600 text-white p-2 rounded-t-lg">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="text-white hover:text-gray-300 focus:outline-none mr-2"
          >
            <FaArrowLeft size={20} />
          </button>
          <h3 className="text-lg font-semibold">{getNickname(selectedChat, localStorage.getItem("memberId"))}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 focus:outline-none"
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start mb-2 ${
              msg.senderId === Number(localStorage.getItem("memberId")) ? "justify-end" : "justify-start"
            }`}
          >
            {msg.senderId !== Number(localStorage.getItem("memberId")) && (
              <img
                src={getProfile(selectedChat, localStorage.getItem("memberId"))}
                alt={selectedChat.name}
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <div
              className={`p-2 rounded-lg text-sm shadow ${
                msg.senderId === Number(localStorage.getItem("memberId"))
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-2 border-t flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
