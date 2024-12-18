import React from "react";
import ProfileHoverCard from "./ProfileHoverCard";

const FollowingTab = () => {
  // 모킹 데이터
  const following = [
    { id: 1, profileImage: "/cute3.png", username: "user789", nickname: "User Three" },
    { id: 2, profileImage: "/cute4.png", username: "user101", nickname: "User Four" },
  ];

  const handleFollow = (username) => {
    alert(`${username}님을 팔로우 취소했습니다.`);
  };

  const handleNewChat = (username) => {
    alert(`${username}님과 새 채팅을 시작합니다.`);
  };

  return (
    <div className="text-left mt-6 space-y-4">
      <h3 className="text-xl font-semibold mb-4">내가 팔로우하는 사람들</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {following.map((follow) => (
          <ProfileHoverCard
            key={follow.id}
            profileImage={follow.profileImage}
            username={follow.username}
            nickname={follow.nickname}
            onFollow={() => handleFollow(follow.username)}
            onChat={() => handleNewChat(follow.username)}
          />
        ))}
      </div>
    </div>
  );
};

export default FollowingTab;
