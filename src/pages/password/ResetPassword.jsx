import React, { useState } from "react";
import apiClient from "../../utils/apiClient";
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async () => {
    try {
      await apiClient.post("/passwords/change", {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setSuccess("Password changed successfully!");
      setError("");
      navigate("/");
    } catch (error) {
      setError("Failed to change password. Please check your input.");
      setSuccess("");
    }
  };

  return (
    <div className="bg-white py-10 px-6 text-center">
      <h2 className="text-xl font-bold">Reset Password</h2>

      <div className="mt-6">
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
          className="border rounded px-4 py-2 w-64"
        />
      </div>

      <div className="mt-4">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="border rounded px-4 py-2 w-64"
        />
      </div>

      <div className="mt-4">
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
          className="border rounded px-4 py-2 w-64"
        />
      </div>

      {error && <p className="mt-2 text-red-500">{error}</p>}
      {success && <p className="mt-2 text-green-500">{success}</p>}

      <button
        onClick={handleChangePassword}
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Change Password
      </button>
    </div>
  );
};

export default ResetPassword;
