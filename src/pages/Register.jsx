import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    nickname: "",
    password: "",
  });
  const [profileImage, setProfileImage] = useState(null); // 프로필 이미지 파일
  const [profilePreview, setProfilePreview] = useState(null); // 이미지 미리보기 URL
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // 업로드된 파일 가져오기
    setProfileImage(file);

    if (file) {
      // 파일 미리보기 URL 생성
      const imageUrl = URL.createObjectURL(file);
      setProfilePreview(imageUrl);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("nickname", formData.nickname);
      formDataToSend.append("password", formData.password);
      if (profileImage) {
        formDataToSend.append("profileImage", profileImage); // 이미지 추가
      }

      const response = await axios.post(
        "http://localhost:8080/auth/register",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } } // 파일 업로드 설정
      );

      console.log("회원가입 성공:", response.data);
      setIsLoading(false);
      alert("가입 성공! 입력하신 이메일에서 인증 메일을 확인해주세요.");
      navigate("/");
    } catch (err) {
      console.error("회원가입 실패:", err);
      setError(err.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center mt-10 space-y-4">
      <h1 className="text-2xl font-bold">회원가입</h1>
      <form onSubmit={handleRegister} className="w-full max-w-sm flex flex-col space-y-4">
        <div>
          {/* 프로필 이미지 미리보기 */}
          <div className="flex flex-col items-center mb-4">
            {profilePreview && (
              <img
                src={profilePreview}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-full border-4 border-gray-300"
              />
            )}
          </div>
          <label className="block mb-1 font-semibold">
            이메일 <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">닉네임 (선택)</label>
          <input
            type="text"
            name="nickname"
            placeholder="닉네임"
            value={formData.nickname}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">
            비밀번호 <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

        {/* 프로필 이미지 업로드 */}
        <div>
          <label className="block mb-1 font-semibold">프로필 이미지 (선택)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
        >
          가입하기
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>

      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white">로딩 중...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
