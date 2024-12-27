import React, { useState } from "react";
import apiClient from "../../utils/apiClient";

const BioUpdateModal = ({ currentBio, onClose, onBioChange }) => {
  const [bio, setBio] = useState(currentBio || "");

  const handleSubmit = async () => {
    try {
      const response = await apiClient.put("/profile/bio-updates", { bio });
      onBioChange(response.data.data.bio); // 업데이트된 bio 반영
      alert("소개가 성공적으로 변경되었습니다.");
      onClose();
    } catch (error) {
      console.error("Failed to update bio:", error);
      alert("소개 변경에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded p-6 shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">소개 변경</h2>
        <textarea
          className="w-full border p-2 rounded"
          rows="4"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleSubmit}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default BioUpdateModal;
