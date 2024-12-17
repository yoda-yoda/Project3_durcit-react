import React from "react";

const FollowersTab = () => {
  // 모킹 데이터
  const followers = [
    { id: 1, name: "User1", profileImage: "/cute1.png" },
    { id: 2, name: "User2", profileImage: "/cute2.png" },
  ];

  return (
    <div className="text-left mt-6 space-y-4">
      <h3 className="text-xl font-semibold mb-4">나를 팔로우하는 사람들</h3>
      {followers.map((follower) => (
        <div key={follower.id} className="flex items-center space-x-4 p-4 border rounded-lg">
          <img
            src={follower.profileImage}
            alt={follower.name}
            className="w-12 h-12 rounded-full"
          />
          <span className="text-lg font-medium">{follower.name}</span>
        </div>
      ))}
    </div>
  );
};

export default FollowersTab;
