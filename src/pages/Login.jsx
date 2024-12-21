import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setTokens } from "../store/authSlice";
import { useWebSocket } from "../context/WebSocketContext";

const Login = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { setIsLoggedIn } = useWebSocket();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:8080/auth/login", {
                email,
                password,
            });

            const { accessToken, refreshToken } = response.data;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            dispatch(setTokens({ accessToken, refreshToken }));
            setIsLoggedIn(true);
            onClose(); // Close the modal after successful login
            window.location.reload();
            navigate("/"); // Navigate to the main page
        } catch (err) {
            console.error("로그인 실패:", err);
            setError(err.response?.data?.message || "로그인 중 오류가 발생했습니다.");
        }
    };

    if (!isOpen) return null; // Do not render anything if the modal is not open

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          {/* Modal content */}
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                  &times;
              </button>

              {/* Login Content */}
              <h1 className="text-2xl font-bold mb-4 text-center">Social Login</h1>
              <div className="flex flex-col space-y-4 items-center">
                  <a
                    href="http://localhost:8080/oauth2/authorization/google"
                    className="flex justify-center items-center min-w-36 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 "
                  >
                      Google 로그인
                  </a>
                  <a
                    href="http://localhost:8080/oauth2/authorization/kakao"
                    className="flex justify-center items-center min-w-36 px-4 py-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500"
                  >
                      Kakao 로그인
                  </a>
                  <a
                    href="http://localhost:8080/oauth2/authorization/naver"
                    className="flex justify-center items-center min-w-36 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                  >
                      Naver 로그인
                  </a>
              </div>

              <div className="mt-10">
                  <h2 className="text-xl font-bold mb-4 text-center">직접 로그인</h2>
                  <form onSubmit={handleLogin} className="flex flex-col space-y-4">
                      <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        required
                      />
                      <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        required
                      />
                      <div className="">
                          <button
                            type="submit"
                            className="w-full px-4 py-2 bg-red-700 text-white rounded-full hover:bg-red-800"
                          >
                              로그인
                          </button>
                      </div>

                  </form>
                  <button
                    onClick={() => {
                        onClose(); // Close the login modal
                        navigate("/register");
                    }}
                    className="mt-4 text-red-700 hover:underline"
                  >
                      계정이 없으신가요? 가입하기
                  </button>
              </div>
          </div>
      </div>
    );
};

export default Login;
