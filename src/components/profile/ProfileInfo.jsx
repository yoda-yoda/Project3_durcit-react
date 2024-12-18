import React from "react";

const ProfileInfo = ({ onProfileImageClick, onPasswordChangeClick }) => {
  return (
    <div className="flex items-center space-x-4">
      <img
        src="/cute1.png"
        alt="User Avatar"
        className="w-24 h-24 rounded-full shadow-md"
      />
      <div className="text-left">
        <h2 className="text-3xl font-bold text-gray-800">DURCIT8567</h2>
        <p className="text-gray-500 text-sm">u/DURCIT8567</p>
        <p className="text-gray-500 text-sm">이메일: user@example.com</p>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={onProfileImageClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            프로필 사진 변경
          </button>
          <button
            onClick={onPasswordChangeClick}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
