import React, { useState, useEffect } from "react";
import apiClient from "../../utils/apiClient";
import NicknameModal from "./NicknameModal";
import BioUpdateModal from "./BioUpdateModal";

const ProfileInfo = ({ onProfileImageClick, onPasswordChangeClick }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/profile");
        setProfile(response.data.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        alert("프로필 정보를 가져오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleOpenNicknameModal = () => {
    setIsNicknameModalOpen(true);
  };

  const handleCloseNicknameModal = () => {
    setIsNicknameModalOpen(false);
  };

  const handleOpenBioModal = () => {
    setIsBioModalOpen(true);
  };

  const handleCloseBioModal = () => {
    setIsBioModalOpen(false);
  };

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
        <p className="text-gray-500 text-sm">소개: {profile.bio || "설정되지 않음"}</p>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={onProfileImageClick}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            프로필 사진 변경
          </button>
          <button
            onClick={onPasswordChangeClick}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            비밀번호 변경
          </button>
          <button
            onClick={handleOpenNicknameModal}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            닉네임 변경
          </button>
          <button
            onClick={handleOpenBioModal}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            소개 변경
          </button>
        </div>
      </div>
      {isNicknameModalOpen && (
        <NicknameModal
          currentNickname={profile.nickname}
          onClose={handleCloseNicknameModal}
          onNicknameChange={(newNickname) => setProfile({ ...profile, nickname: newNickname })}
        />
      )}
      {isBioModalOpen && (
        <BioUpdateModal
          currentBio={profile.bio}
          onClose={handleCloseBioModal}
          onBioChange={(newBio) => setProfile({ ...profile, bio: newBio })}
        />
      )}
    </div>
  );
};

export default ProfileInfo;
