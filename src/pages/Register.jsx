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
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // 에러 메시지 초기화

    try {
      const response = await axios.post("http://localhost:8080/auth/register", formData);
      console.log("회원가입 성공:", response.data);

      navigate("/login");
    } catch (err) {
      console.error("회원가입 실패:", err);
      setError(err.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 space-y-4">
      <h1 className="text-2xl font-bold">회원가입</h1>
      <form onSubmit={handleRegister} className="w-full max-w-sm flex flex-col space-y-4">
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="nickname"
          placeholder="닉네임"
          value={formData.nickname}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          가입하기
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-blue-500 hover:underline"
        >
          이미 계정이 있으신가요? 로그인
        </button>
      </form>
    </div>
  );
};

export default Register;
