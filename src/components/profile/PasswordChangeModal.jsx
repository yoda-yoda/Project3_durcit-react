import React, { useState } from "react";

const PasswordChangeModal = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState(""); // 현재 비밀번호
  const [password, setPassword] = useState(""); // 새 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(""); // 새 비밀번호 확인

  const handleSubmit = () => {
    if (!currentPassword) {
      alert("현재 비밀번호를 입력해주세요!");
      return;
    }

    if (password !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다!");
      return;
    }

    if (password === currentPassword) {
      alert("새 비밀번호는 현재 비밀번호와 달라야 합니다!");
      return;
    }

    // 비밀번호 변경 로직
    alert("비밀번호가 변경되었습니다!");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">비밀번호 변경</h2>
        <div className="flex flex-col space-y-4">
          {/* 현재 비밀번호 입력 */}
          <input
            type="password"
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* 새 비밀번호 입력 */}
          <input
            type="password"
            placeholder="새 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* 비밀번호 확인 */}
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
