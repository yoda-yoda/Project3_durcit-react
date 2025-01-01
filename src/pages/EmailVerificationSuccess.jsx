import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {apiClientNoAuth} from "../utils/apiClient";

const EmailVerificationSuccess = () => {
  const location = useLocation();
  const [statusMessage, setStatusMessage] = useState(
    "Your email verification is being processed. Please wait..."
  );

  useEffect(() => {
    // Extract token from URL
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      // Send token to backend
      apiClientNoAuth
        .post("/auth/verify", { token })
        .then((response) => {
          console.log("Verification successful:", response.data);
          setStatusMessage("Your email has been successfully verified. Thank you!");
        })
        .catch((error) => {
          console.error("Verification failed:", error);
          setStatusMessage("Email verification failed. Please try again.");
        });
    } else {
      setStatusMessage("Invalid verification link.");
    }
  }, [location]);

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Email Verification
        </h1>
        <p className="text-gray-600">{statusMessage}</p>
      </div>
    </div>
  );
};

export default EmailVerificationSuccess;
