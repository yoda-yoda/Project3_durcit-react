import React, { useState } from "react";
import apiClient from "../../utils/apiClient";

const NicknameModal = ({ currentNickname, onClose, onNicknameChange }) => {
  const [nickname, setNickname] = useState(currentNickname || "");
  const [isChecking, setIsChecking] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkNicknameDuplicate = async () => {
    setIsChecking(true);
    try {
      const response = await apiClient.get("/profile/nickname-checks", {
        params: { nickname },
      });
      setIsDuplicate(response.data.data); // 서버에서 중복 여부 반환
    } catch (error) {
      console.error("닉네임 중복 확인 실패:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleNicknameSubmit = async () => {
    if (isDuplicate) {
      alert("이미 사용 중인 닉네임입니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.put("/profile/nickname-updates", { nickname });
      onNicknameChange(response.data.data.nickname); // 부모 컴포넌트에 닉네임 변경 알림
      alert("닉네임이 성공적으로 변경되었습니다.");
      onClose();
    } catch (error) {
      console.error("닉네임 변경 실패:", error);
      alert("닉네임 변경에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value); // 입력값 업데이트
    setIsDuplicate(false); // 닉네임 변경 시 중복 상태 초기화
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">닉네임 변경</h2>
        <div className="mb-4">
          <label className="block text-gray-700">새 닉네임</label>
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              value={nickname}
              onChange={handleNicknameChange} // 닉네임 입력값 변경
              className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={checkNicknameDuplicate}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={isChecking}
            >
              {isChecking ? "확인 중..." : "중복 확인"}
            </button>
          </div>
          {isDuplicate && (
            <p className="text-red-500 text-sm mt-1">이미 사용 중인 닉네임입니다.</p>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            취소
          </button>
          <button
            onClick={handleNicknameSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={isSubmitting || isDuplicate}
          >
            {isSubmitting ? "변경 중..." : "변경"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NicknameModal;
