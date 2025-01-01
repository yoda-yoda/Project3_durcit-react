import React, { useState, useEffect } from "react";
import { apiClient } from "../../utils/apiClient";

const OverviewTab = () => {
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBio = async () => {
      try {
        const response = await apiClient.get("/profile/bio");
        setBio(response.data.data || "소개가 없습니다.");
      } catch (error) {
        console.error("Failed to fetch bio:", error);
        alert("소개 정보를 가져오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBio();
  }, []);

  if (isLoading) {
    return <div className="text-left mt-6">Loading...</div>;
  }

  return (
    <div className="text-left mt-6">
      <p className="text-lg font-medium text-gray-600">
        프로필 개요를 확인할 수 있습니다.
      </p>
      <div className="mt-4">
        <h3 className="text-md font-semibold text-gray-800">소개</h3>
        <p className="text-gray-500 text-sm mt-2">{bio}</p>
      </div>
    </div>
  );
};

export default OverviewTab;
