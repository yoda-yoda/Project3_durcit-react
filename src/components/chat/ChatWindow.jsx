import React, { useState } from "react";
import { FaTimes, FaArrowLeft } from "react-icons/fa";

const ChatWindow = ({ selectedChat, onSendMessage, onClose, onBack }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() === "") return;
    onSendMessage(message);
    setMessage("");
  };

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
          <h3 className="text-lg font-semibold">{selectedChat.name}</h3>
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
        {selectedChat.messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start mb-2 ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender !== "me" && (
              <img
                src={selectedChat.profileImage}
                alt={selectedChat.name}
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <div
              className={`p-2 rounded-lg text-sm shadow ${
                msg.sender === "me"
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
          className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
