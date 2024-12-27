import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/apiClient"; // 유틸리티 클래스 가져오기

const RequestVerificationCode = () => {
  const [timer, setTimer] = useState(300); // 5분 타이머 (300초)
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 타이머 동작
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // 인증번호 요청
  useEffect(() => {
    const requestVerificationCode = async () => {
      try {
        await apiClient.post("/passwords/request");
      } catch (error) {
        console.error("Error sending verification code:", error);
      }
    };

    requestVerificationCode();
  }, []);

  // 인증번호 확인
  const handleVerify = async () => {
    try {
      const response = await apiClient.post("/passwords/verify", {
        code: verificationCode,
      });

      if (response.status === 204) {
        navigate("/reset-password"); // 비밀번호 변경 페이지로 이동
      }
    } catch (error) {
      setError("Invalid or expired verification code.");
    }
  };

  return (
    <div className="bg-white py-10 px-6 text-center">
      <h2 className="text-xl font-bold">Verification Code</h2>
      <p className="text-gray-600">Enter the verification code sent to your email.</p>

      <div className="mt-6">
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter verification code"
          className="border rounded px-4 py-2 w-64"
        />
      </div>

      {timer > 0 ? (
        <div className="mt-4 text-red-600 font-bold">
          {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
        </div>
      ) : (
        <div className="mt-4 text-gray-600">Verification code expired. Please try again.</div>
      )}

      {error && <p className="mt-2 text-red-500">{error}</p>}

      <button
        onClick={handleVerify}
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        disabled={timer <= 0}
      >
        Verify
      </button>
    </div>
  );
};

export default RequestVerificationCode;
