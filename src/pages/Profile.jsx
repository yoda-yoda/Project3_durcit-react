import React, { useState } from "react";
import ProfileInfo from "../components/profile/ProfileInfo";
import TabMenu from "../components/profile/TabMenu";
import OverviewTab from "../components/profile/OverviewTab";
import PostsTab from "../components/profile/PostsTab";
import CommentsTab from "../components/profile/CommentsTab";
import ProfileImageModal from "../components/profile/ProfileImageModal";
import PasswordChangeModal from "../components/profile/PasswordChangeModal";

import FollowersTab from "../components/profile/FollowersTab";
import FollowingTab from "../components/profile/FollowingTab";

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState("overview");

    // 모달 상태 관리
    const [isProfileImageModalOpen, setProfileImageModalOpen] = useState(false);
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
      <div className="bg-white py-10 px-6">
          {/* 프로필 정보 */}
          <ProfileInfo
            onProfileImageClick={() => setProfileImageModalOpen(true)}
            onPasswordChangeClick={() => setPasswordModalOpen(true)}
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
          {isPasswordModalOpen && (
            <PasswordChangeModal onClose={() => setPasswordModalOpen(false)} />
          )}
      </div>
    );
};

export default UserProfile;
