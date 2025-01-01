import React, { useState } from "react";
import { apiClient } from "../../utils/apiClient";

const ProfileImageModal = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await apiClient.put("/profile", formData);
      alert("프로필 사진이 성공적으로 변경되었습니다!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("프로필 사진 변경 중 오류 발생:", error);
      alert("프로필 사진 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">프로필 사진 변경</h2>
        <div className="flex flex-col items-center">
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 rounded-full mb-4 border shadow"
            />
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
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

export default ProfileImageModal;
