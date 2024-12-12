import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setTokens } from "../store/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      const {accessToken, refreshToken} = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      dispatch(setTokens({accessToken, refreshToken}));

      navigate("/"); // 메인 페이지로 이동
    } catch (err) {
      console.error("로그인 실패:", err);
      setError(err.response?.data?.message || "로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 space-y-4">
      <h1 className="text-2xl font-bold">Social Login</h1>
      <a
        href="http://localhost:8080/oauth2/authorization/google"
        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Google 로그인
      </a>
      <a
        href="http://localhost:8080/oauth2/authorization/kakao"
        className="px-6 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500"
      >
        Kakao 로그인
      </a>
      <a
        href="http://localhost:8080/oauth2/authorization/naver"
        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Naver 로그인
      </a>

      <div className="w-full max-w-sm mt-10">
        <h2 className="text-xl font-bold mb-4">직접 로그인</h2>
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            로그인
          </button>
        </form>
        <button
          onClick={() => navigate("/register")}
          className="mt-4 text-blue-500 hover:underline"
        >
          계정이 없으신가요? 가입하기
        </button>
      </div>
    </div>
  );
};

export default Login;
