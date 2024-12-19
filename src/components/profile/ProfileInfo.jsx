import React, { useState, useEffect } from "react";
import apiClient from "../../utils/apiClient";

const ProfileInfo = ({ onProfileImageClick, onPasswordChangeClick }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/profile");
        setProfile(response.data.data); // API 응답 데이터를 상태로 설정
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        alert("프로필 정보를 가져오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>프로필 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={profile.profileImage || "/default-profile.png"}
        alt="User Avatar"
        className="w-24 h-24 rounded-full shadow-md"
      />
      <div className="text-left">
        <h2 className="text-3xl font-bold text-gray-800">{profile.nickname || profile.username}</h2>
        <p className="text-gray-500 text-sm">이메일: {profile.email}</p>
        <p className="text-gray-500 text-sm">권한: {profile.role}</p>
        <p className="text-gray-500 text-sm">제공자: {profile.provider || "N/A"}</p>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={onProfileImageClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            프로필 사진 변경
          </button>
          <button
            onClick={onPasswordChangeClick}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
