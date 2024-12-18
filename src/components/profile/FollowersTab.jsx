import React from "react";
import ProfileHoverCard from "./ProfileHoverCard";

const FollowersTab = () => {
  // 모킹 데이터
  const followers = [
    { id: 1, profileImage: "/cute1.png", username: "user123", nickname: "User One" },
    { id: 2, profileImage: "/cute2.png", username: "user456", nickname: "User Two" },
  ];

  const handleFollow = (username) => {
    alert(`${username}님을 팔로우했습니다.`);
  };

  const handleNewChat = (username) => {
    alert(`${username}님과 새 채팅을 시작합니다.`);
  };

  return (
    <div className="text-left mt-6 space-y-4">
      <h3 className="text-xl font-semibold mb-4">나를 팔로우하는 사람들</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {followers.map((follower) => (
          <ProfileHoverCard
            key={follower.id}
            profileImage={follower.profileImage}
            username={follower.username}
            nickname={follower.nickname}
            onFollow={() => handleFollow(follower.username)}
            onChat={() => handleNewChat(follower.username)}
          />
        ))}
      </div>
    </div>
  );
};

export default FollowersTab;
