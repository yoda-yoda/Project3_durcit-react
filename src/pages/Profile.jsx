import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "../components/profile/ProfileInfo";
import TabMenu from "../components/profile/TabMenu";
import OverviewTab from "../components/profile/OverviewTab";
import PostsTab from "../components/profile/PostsTab";
import CommentsTab from "../components/profile/CommentsTab";
import ProfileImageModal from "../components/profile/ProfileImageModal";

import FollowersTab from "../components/profile/FollowersTab";
import FollowingTab from "../components/profile/FollowingTab";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

    // 모달 상태 관리
  const [isProfileImageModalOpen, setProfileImageModalOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handlePasswordChangeClick = () => {
      // 비밀번호 변경 페이지로 이동
    navigate("/request-verification");
  };

  return (
    <div className="bg-white py-10 px-6">
      {/* 프로필 정보 */}
      <ProfileInfo
        onProfileImageClick={() => setProfileImageModalOpen(true)}
        onPasswordChangeClick={handlePasswordChangeClick}
      />

      {/* 탭 메뉴 */}
      <TabMenu activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 탭 내용 */}
      <div className="mt-10">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "posts" && <PostsTab />}
        {activeTab === "comments" && <CommentsTab />}
        {activeTab === "followers" && <FollowersTab />}
        {activeTab === "following" && <FollowingTab />}
      </div>

      {/* 모달 */}
      {isProfileImageModalOpen && (
        <ProfileImageModal onClose={() => setProfileImageModalOpen(false)} />
      )}
    </div>
  );
};

export default UserProfile;
